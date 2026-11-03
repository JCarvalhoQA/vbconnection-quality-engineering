import { LoginCredentials, LoginPersona, loginMass } from '../fixtures/login';

export class LoginFactory {
  static credentials(persona: LoginPersona): LoginCredentials {
    const mass = loginMass[persona];
    if (!mass?.username || !mass.password) {
      throw new Error(`Massa de login ausente para persona "${persona}"`);
    }

    return { ...mass };
  }

  static padded(persona: LoginPersona): LoginCredentials {
    const credentials = LoginFactory.credentials(persona);
    return {
      ...credentials,
      username: `  ${credentials.username}  `,
      password: `  ${credentials.password}  `,
    };
  }
}
