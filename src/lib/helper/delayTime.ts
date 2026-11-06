export const delayTime = (data: number) => {
  if (data % 4 === 1) {
    return 0;
  } else if (data % 4 == 2) {
    return 0.25;
  } else if (data % 4 == 3) {
    return 0.35;
  } else if (data % 4 == 0) {
    return 0.45;
  }
};

export const delayTime2 = (data: number) => {
  if (data % 3 === 1) {
    return 0;
  } else if (data % 3 == 2) {
    return 0.25;
  } else if (data % 3 == 0) {
    return 0.35;
  }
};

export const delayTime3 = (data: number) => {
  if (data % 6 === 1) {
    return 0;
  } else if (data % 6 == 2) {
    return 0.25;
  } else if (data % 6 == 3) {
    return 0.55;
  } else if (data % 6 == 4) {
    return 0.45;
  } else if (data % 6 == 5) {
    return 0.35;
  } else if (data % 6 == 0) {
    return 0.65;
  }
};
