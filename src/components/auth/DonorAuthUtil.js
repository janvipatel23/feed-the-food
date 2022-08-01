import { Amplify, Auth } from "aws-amplify";

export const DonorAuthConfigure = () => {
  Amplify.configure({
    Auth: {
      region: "us-west-2",
      userPoolId: "us-west-2_EPNW38Fpf",
      userPoolWebClientId: "h8ci6aqhbtnt7omfe04kguefe",
    },
  });
};

export const NGOAuthConfigure = () => {
  Amplify.configure({
    Auth: {
      region: "us-west-2",
      userPoolId: "us-west-2_TUFa9Gpk2",
      userPoolWebClientId: "3o1md3du72323pdufe35f94dml",
    },
  });
};

export const AdminAuthConfigure = () => {
  Amplify.configure({
    Auth: {
      region: "us-west-2",
      userPoolId: "us-west-2_k2y5QSdHG",
      userPoolWebClientId: "soaispb3gacv5opuub0guno9q",
    },
  });
};

export const CreateAccountInDonorPool = (name, email, password) => {
  return Auth.signUp({
    username: email,
    password: password,
    attributes: {
      email: email,
      name: name,
    },
  });
};

export const SignInAsDonor = (email, password) => {
  return Auth.signIn(email, password);
};

export const confirmDonorAccount = (email, code) => {
  return Auth.confirmSignUp(email, code);
};
