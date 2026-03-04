import { gql } from '@kma/utils';
import { MenuItemType } from '@kma/api-interface';

// 서버에서 메뉴 목록을 가져오는 API
export async function getDynamicMenus(): Promise<MenuItemType[]> {
  const query = `
    query GetMenuList {
      menuList {
        id
        label
        path
        children {
          id
          label
          path
        }
      }
    }
  `;

  try {
    const res = await gql<{ menuList: MenuItemType[] }>(query);
    return res.menuList || [];
  } catch (error) {
    console.error('Menu load failed:', error);
    return [];
  }
}
