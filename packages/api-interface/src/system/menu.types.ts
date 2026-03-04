export type MenuItemType = {
  id: string;
  label: string;
  path?: string;
  // parentId?: string;
  // sort?: number;
  children?: MenuItemType[];
};
