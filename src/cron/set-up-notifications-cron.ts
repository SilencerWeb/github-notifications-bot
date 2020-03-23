import { CronJob } from 'cron';
import axios from 'axios';
import MarkdownIt from 'markdown-it';
import { getUsers, updateUser, getNotifications } from '../api';
import { bot } from '../bot';

const getSubjectDetails = ({ auth, subjectUrl }) => {
  return axios.get(subjectUrl, { auth })
    .then((response) => response.data)
    .catch((error) => {
      console.log(`Error on getting subject details: ${error.message}`);
      return null;
    });
};

let isFunctionRunning = false;
export const setUpNotificationsCron = () => {
  return new CronJob('*/10 * * * * *', async () => {
    if (isFunctionRunning) return;
    isFunctionRunning = true;
    const users = await getUsers();
    if (!users) return;

    await Promise.all(
      users.map(async (user) => {
        if (!user.github.username || !user.github.token) return;

        const since = user.lastTimeChecked;
        if (since) since.setMilliseconds(since.getMilliseconds() + 1);
        const notifications = await getNotifications({
          username: user.github.username,
          token: user.github.token,
          since: since ? since : null,
        });
        const lastTimeChecked = new Date();
        if (!notifications) return;

        for (let i = 0; i < notifications.length; i++) {
          const notification = notifications[i];

          const subjectDetails = await getSubjectDetails({
            auth: { username: user.github.username, password: user.github.token },
            subjectUrl: notification.subject.latest_comment_url ? notification.subject.latest_comment_url : notification.subject.url,
          });

          let message: string;

          const notificationType = notification.subject.type === 'PullRequest' ? 'pull request' : notification.subject.type.toLowerCase();
          const repositoryURL = `<a href="${notification.repository.html_url}">${notification.repository.full_name}</a>`;

          let notificationReason = '—\n';
          switch (notification.reason) {
            case 'assign':
              notificationReason += '<i>You are receiving this because you were assigned</i>';
              break;
            case 'author':
              notificationReason += '<i>You are receiving this because you created the thread</i>';
              break;
            case 'comment':
              notificationReason += '<i>You are receiving this because you commented on the thread</i>';
              break;
            case 'invitation':
              notificationReason += '<i>You are receiving this because you accepted an invitation to contribute to the repository</i>';
              break;
            case 'manual':
              notificationReason += '<i>You are receiving this because you subscribed to the thread</i>';
              break;
            case 'mention':
              notificationReason += '<i>You are receiving this because you were mentioned</i>';
              break;
            case 'review_requested':
              notificationReason += '<i>You are receiving this because your review was requested</i>';
              break;
            case 'security_alert':
              notificationReason += '<i>You are receiving this because you have alerting access</i>';
              break;
            case 'state_change':
              notificationReason += '<i>You are receiving this because you modified the open/close state</i>';
              break;
            case 'subscribed':
              notificationReason += '<i>You are receiving this because you are watching the repository</i>';
              break;
            case 'team_mention':
              notificationReason += '<i>You are receiving this because you were on a team that was mentioned</i>';
              break;
          }

          if (subjectDetails) {
            const userURL = `<a href="${subjectDetails.user.html_url}">@${subjectDetails.user.login}</a>`;
            const subjectURL = `<a href="${subjectDetails.html_url}">${notification.subject.title}</a>`;

            if (subjectDetails.requested_reviewers) {
              const title = `🔔 ${userURL} requested your review on the ${notificationType} ${subjectURL} in the repository ${repositoryURL}`;
              message = `${title}\n\n${notificationReason}`;
            } else if (subjectDetails.assignee) {
              const title = `🔔 You got assigned to the ${notificationType} ${subjectURL} in the repository ${repositoryURL}`;
              message = `${title}\n\n${notificationReason}`;
            } else {
              const title = `🔔 You got a new notification in the ${notificationType} ${subjectURL} in the repository ${repositoryURL}`;
              let comment: string;
              if (subjectDetails.body) {
                const markdownParser = new MarkdownIt();
                // TODO: Display images as linked text <a href="link-to-image">image</a>
                markdownParser.renderer.rules.image = () => ''; // We can't display images in the Telegram
                comment = markdownParser.renderInline(subjectDetails.body).trim();
                message = `${title}\n\n${comment}\n\n${notificationReason}`;
              } else {
                message = `${title}\n\n${notificationReason}`;
              }
            }
          } else {
            const title = `🔔 You got a new notification in the ${notificationType} ${notification.subject.title} in the repository ${repositoryURL}`;
            message = `${title}\n\n${notificationReason}`;
          }

          await bot.telegram.sendMessage(user.telegram.id, message, {
            parse_mode: 'HTML',
            disable_web_page_preview: true,
          })
            .then(() => updateUser(user.telegram.id, { lastTimeChecked }))
            .catch((error) => console.log(`Error on sending a message: ${error.message}\n\n${message}`));
        }
      }),
    );

    isFunctionRunning = false;
  }, null, true);
};