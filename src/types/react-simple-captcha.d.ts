declare module "react-simple-captcha" {
  import React from "react";

  export function loadCaptchaEnginge(size: number): void;
  export function validateCaptcha(userInput: string): boolean;
  export function LoadCanvasTemplate(): JSX.Element;
  export function LoadCanvasTemplateNoReload(): JSX.Element;
}
