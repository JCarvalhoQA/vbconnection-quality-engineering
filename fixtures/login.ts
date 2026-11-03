import loginMassFile from './login.mass.json';

export interface LoginCredentials {
  username: string;
  password: string;
  nome?: string;
  email?: string;
  perfil?: string;
  roles?: string[];
}

export interface LoginMass {
  admin: LoginCredentials;
  invalid: LoginCredentials;
  twoFactor: LoginCredentials;
  expired: LoginCredentials;
  offline: LoginCredentials;
}

export type LoginPersona = keyof LoginMass;

function overlayEnv(mass: LoginMass): LoginMass {
  return {
    admin: {
      ...mass.admin,
      username: process.env.PLAYWRIGHT_USER ?? mass.admin.username,
      password: process.env.PLAYWRIGHT_PASSWORD ?? mass.admin.password,
      nome: process.env.PLAYWRIGHT_ADMIN_NAME ?? mass.admin.nome,
      email: process.env.PLAYWRIGHT_ADMIN_EMAIL ?? mass.admin.email,
      perfil: process.env.PLAYWRIGHT_ADMIN_PERFIL ?? mass.admin.perfil,
    },
    invalid: {
      ...mass.invalid,
      username: process.env.PLAYWRIGHT_USER_INVALID ?? mass.invalid.username,
      password: process.env.PLAYWRIGHT_PASSWORD_INVALID ?? mass.invalid.password,
    },
    twoFactor: {
      ...mass.twoFactor,
      username: process.env.PLAYWRIGHT_USER_2FA ?? mass.twoFactor.username,
      password: process.env.PLAYWRIGHT_PASSWORD_2FA ?? mass.twoFactor.password,
      email: process.env.PLAYWRIGHT_USER_2FA_EMAIL ?? mass.twoFactor.email,
    },
    expired: {
      ...mass.expired,
      username: process.env.PLAYWRIGHT_USER_EXPIRED ?? mass.expired.username,
      password: process.env.PLAYWRIGHT_PASSWORD_EXPIRED ?? mass.expired.password,
    },
    offline: {
      ...mass.offline,
      username: process.env.PLAYWRIGHT_USER_OFFLINE ?? mass.offline.username,
      password: process.env.PLAYWRIGHT_PASSWORD_OFFLINE ?? mass.offline.password,
    },
  };
}

export const loginMass: LoginMass = overlayEnv(loginMassFile as LoginMass);
