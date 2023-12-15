// 用 '/' 拼接前后两个路径，保证两个路径之间只有一个 '/'
export function joinPath(parentPath: string, childPath: string) {
  if (!childPath) {
    return parentPath;
  }
  // 以绝对路径开头时不拼接
  if (childPath.startsWith('/')) {
    return childPath;
  }
  if (!parentPath) {
    return '/' + childPath;
  }
  if (parentPath.endsWith('/')) {
    parentPath = parentPath.substring(0, parentPath.length - 1);
  }
  return parentPath + '/' + childPath;
}
