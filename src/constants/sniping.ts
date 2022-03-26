import { displayName } from '../../package.json';

export const SNIPING_TEMPLATE_DRAFT_TITLE = `${displayName}狙擊範本`;

export const SNIPING_TEMPLATE_VARIABLES_MAPPING = {
  '會員編號': '{{ user.user_id }}',
  '會員名稱': '{{ user.nickname }}',
  '註冊日期': '{{ user.registrationDate }}',
  '標籤項目': '{{ #labels }}{{ >snipingLabelItem }}\n\n{{ /labels }}',
  '標籤截圖': '{{ #labels }}{{ >snipingLabelImage }}\n{{ /labels }}',
  '訂閱名單': '{{ #subscriptions.length }}-------------\n{{ #subscriptions }}{{ >subscriptionItem }}{{ /subscriptions }}{{ /subscriptions.length }}',
  '宣傳簽名': '-------------\n{{ >promotion }}'
};
