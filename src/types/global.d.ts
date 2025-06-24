declare global {
  var tempOTPs: {
    [key: string]: {
      otp: string;
      expiresAt: Date;
    };
  } | undefined;
}

export {};
