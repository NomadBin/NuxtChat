/**
 * 异步函数：将指定的文本复制到剪贴板
 *
 * @param text 要复制到剪贴板的字符串文本
 * @returns 返回一个Promise，如果复制成功则Promise解析为true，否则为false
 */
export async function copyToClipboard(text: string) {
  try {
    // 将文本写入剪贴板，并等待操作完成
    await navigator.clipboard.writeText(text);
    // 如果成功，打印成功消息到控制台
    console.log('复制成功！');
    // 返回成功标志：true
    return true;
  } catch (err) {
    // 如果发生错误，打印错误消息到控制台
    console.error('复制失败：', err);
    // 返回失败标志：false
    return false;
  }
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

interface ToastParasm {
  msg: string;
  type?: 'info' | 'success' | 'error';
}
export function showToast({ msg, type = 'info' }: ToastParasm) {
  ElMessage[type](msg);
}

//  元素相对于滚动条的 Y 轴偏移量
export function getElementOffsetY(element: HTMLElement, scrollDom: HTMLElement) {
  if (!scrollDom) {
    return 0;
  }
  let rect = element.getBoundingClientRect();
  // const scrollDom = chatListBoxRef.value as HTMLElement;
  let scrollTop = scrollDom.scrollTop;
  // 元素相对于滚动条的 Y 轴偏移量等于元素的 top 值加上滚动条的滚动距离
  let offsetY = rect.top + scrollTop;
  return offsetY;
}

// 获取当前日期，按照 YYYY-MM-DD HH:MM:SS 的格式拼接成一个字符串返回。
export function getDateString() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始，所以要加 1，并且不足两位的补 0
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 将 YYYY-MM-DD HH:MM:SS 字符串转换成Date
export function stringToDate(dateString: string) {
  // 使用 Date.parse 方法将字符串转换为时间戳
  let timestamp = Date.parse(dateString);
  // 使用时间戳创建 Date 对象
  let date = new Date(timestamp);
  return date;
}

type Callback = (...args: any[]) => void;

/**
 * 防抖函数 - 只有最后一次触发的 delay 毫秒后才会执行 callback
 */
export function debounce(callback: Callback, delay: number = 300): Callback {
  let timer: any | null = null;
  return function (this: any, ...args: any[]) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      callback.apply(this, args);
      timer = null;
    }, delay);
  };
}

// 节流函数
function throttle(callback: Callback, delay: number = 300): Callback {
  let shouldWait = false;
  let waitingArgs: any[] | null = null;
  const timeoutFunc = () => {
    if (waitingArgs == null) {
      shouldWait = false;
    } else {
      callback(...waitingArgs);
      waitingArgs = null;
      setTimeout(timeoutFunc, delay);
    }
  };

  return function (this: any, ...args: any[]) {
    if (shouldWait) {
      waitingArgs = args;
      return;
    }

    callback(...args);
    shouldWait = true;
    setTimeout(timeoutFunc, delay);
  };
}

// 将数字转换成文本形式的格式化大小
export function formatFileSize(bytes: number, fractionDigits: number = 2) {
  if (!bytes && bytes !== 0) return '--';

  const kbSize = bytes / 1024;
  if (kbSize < 1024) {
    return `${kbSize.toFixed(fractionDigits)} KB`;
  } else if (kbSize < 1_048_576) {
    const mbSize = kbSize / 1024;
    return `${mbSize.toFixed(fractionDigits)} MB`;
  } else {
    const gbSize = kbSize / 1_048_576;
    return `${gbSize.toFixed(fractionDigits)} GB`;
  }
}

// 匹配错误信息
export function matchCatchErrorMsg(error: any, msg: string) {
  if (error && error.message && error.message.includes(msg)) {
    return true;
  }
  return false;
}
