export const clickMenu = (label: string) => {
  return cy
    .contains(
      '.ant-menu-item, .ant-menu-submenu-title, .ant-menu-title-content',
      label,
      { matchCase: false }
    )
    .click({ force: true });
};