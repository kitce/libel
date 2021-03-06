export const isMainApp = () => {
  return (
    !isLoginPage()
    && !isEditProfilePage()
    && !isNoticePage()
    && !isStickersPage()
  );
};

const isLoginPage = () => {
  const { pathname } = window.location;
  return pathname === '/login';
};

const isEditProfilePage = () => {
  const { pathname } = window.location;
  return pathname === '/me/profile/edit';
};

export const isNoticePage = () => {
  const { pathname } = window.location;
  return pathname === '/notice';
};

const isStickersPage = () => {
  const { pathname } = window.location;
  return pathname === '/stickers';
};

export const isOffline = () => {
  const cloudflareWrapper = document.querySelector('#cf-wrapper');
  return !!cloudflareWrapper;
};
