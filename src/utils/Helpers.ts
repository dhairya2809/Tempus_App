/* eslint-disable no-useless-escape */
export const logTrace = (msg: string, type: string, object?: any) => {
  let color = '';
  switch (type) {
    case 'success':
      color = '#5F9EA0';
      break;
    case 'info':
      color = 'DodgerBlue';
      break;
    case 'error':
      color = '#FF9494';
      break;
    case 'start':
      color = '#AFE1AF';
      break;
    default:
      color = 'black';
      break;
  }

  console.log(
    '%c' + msg,
    `color:${color};font-weight:bold`,
    object ? object : '',
  );
};

export const validateEmail = (email: string) => {
  const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return reg.test(email) === true ? true : false;
};

export function removeWhiteSpace(str: string) {
  return str?.replace(/\s/g, '');
}

type Message = {
  timestamp: string;
  type: string;
};
export const removeDuplicateTimestamps = (messages: Message[]): Message[] => {
  const uniqueMessages: Record<string, Message> = {};

  // Iterate through the array and keep only the first occurrence of each timestamp
  for (const message of messages) {
    if (!uniqueMessages[message.timestamp]) {
      uniqueMessages[message.timestamp] = message;
    }
  }
  // Convert the object back to an array of messages
  const uniqueMessageArray = Object.values(uniqueMessages);
  return uniqueMessageArray;
};

const Helpers = {
  logTrace,
  validateEmail,
  removeWhiteSpace,
  removeDuplicateTimestamps,
};

export default Helpers;
