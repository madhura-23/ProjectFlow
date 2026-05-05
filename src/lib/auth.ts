import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID ?? "",
  ClientId:   process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID   ?? "",
};

export const userPool = new CognitoUserPool(poolData);

export function signUp(email: string, password: string, name: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const attrs = [new CognitoUserAttribute({ Name: "name", Value: name })];
    userPool.signUp(email, password, attrs, [], (err) => {
      if (err) reject(err); else resolve();
    });
  });
}

export function confirmSignUp(email: string, code: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: userPool });
    user.confirmRegistration(code, true, (err) => {
      if (err) reject(err); else resolve();
    });
  });
}

export function signIn(email: string, password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const authDetails = new AuthenticationDetails({ Username: email, Password: password });
    const user = new CognitoUser({ Username: email, Pool: userPool });
    user.authenticateUser(authDetails, {
      onSuccess: (session) => resolve(session.getIdToken().getJwtToken()),
      onFailure: (err) => reject(err),
    });
  });
}

export function signOut(): void {
  const user = userPool.getCurrentUser();
  if (user) user.signOut();
}

export function getCurrentUser(): Promise<{ email: string; name: string } | null> {
  return new Promise((resolve) => {
    const user = userPool.getCurrentUser();
    if (!user) { resolve(null); return; }
    user.getSession((err: Error | null, session: { isValid: () => boolean } | null) => {
      if (err || !session?.isValid()) { resolve(null); return; }
      user.getUserAttributes((attrErr, attrs) => {
        if (attrErr || !attrs) { resolve(null); return; }
        const get = (n: string) => attrs.find((a) => a.getName() === n)?.getValue() ?? "";
        resolve({ email: get("email"), name: get("name") });
      });
    });
  });
}
