export type MenuDataType = {
  name: string;
  path: string;
  hasChildren?: boolean;
  children?: {
    name: string;
    path: string;
  }[];
}[];

export type ActionBtnType = {
  enable: boolean;
  label: string;
  link: string;
};

export type ServiceDetailsType = {
  title: string;
  short_description: string;
  image: string;
};

export type SingleBlogType = {
  data: {
    title: string;
    image: string;
    date: string;
  };
  content: string;
  slug: string;
};

export type MeetingHeroType = {
  title: string;
  details: string;
  action_btn1: {
    enable: boolean;
    label: string;
    link: string;
    downloadable: boolean;
  };
  action_btn2: {
    enable: boolean;
    label: string;
    link: string;
    downloadable: boolean;
  };
  people: {
    label: string;
    number: number;
    unit: string;
    members: string[];
  };
  video: string;
  video_label: string;
  image1: string;
  image2: string;
  brand_img: string;
  progress: {
    label: string;
    number: number;
    unit: string;
    image: string;
  };
  shape1_img: string;
  shape2_img: string;
  shape3_img: string;
  join_shape1: string;
  join_shape2: string;
  join_shape3: string;
};

export type PricingCardType = {
  name: string;
  key?: string;
  popular?: boolean;
  price: string;
  price_label?: string;
  sub_title?: string;
  features: {
    name: string;
    enable: boolean;
  }[];
  action_btn: ActionBtnType;
  button_color?: string;
};

export type PaginationType<T> = {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  data: T;
};

export type TablePagination = {
  currentPage: number;
  limit: number;
  total: number;
  totalPages: number;
};
