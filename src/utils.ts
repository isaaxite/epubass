import { readdirSync } from "node:fs";
import { MEDIA_TYPES } from "./constant";

export function run<T extends (...args: any[]) => any>(cb: T, ...args: Parameters<T>): ReturnType<T> {
  return cb(...args);
}

/**
 * 根据文件名获取 MIME 类型
 * @param {string} filename - 文件名，例如 "style.css"
 * @returns {string} - MIME 类型，如果无法识别则返回 'application/octet-stream'
 */
export function getMimeTypeFrom(filename?: string) {
  if (!filename) {
    return 'application/octet-stream';
  }
  const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
  return MEDIA_TYPES[ext] || 'application/octet-stream';
}

export function hasCssFiles(dir: string) {
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    return entries.some(entry => entry.isFile() && entry.name.endsWith('.css'));
  } catch (err: any) {
    if (err.code === 'ENOENT') return false; // 目录不存在视为 false
    throw err; // 其他错误向上抛出
  }
}
