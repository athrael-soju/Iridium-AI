import { gray } from '@ant-design/colors';
import { PRIMARY_COLOR_RGB, ACCENT_COLOR_RGB } from '@/constants';

import type { ThemeConfig } from 'antd';

const theme: ThemeConfig = {
  token: {
    fontSize: 16,
    colorPrimary: PRIMARY_COLOR_RGB,
  },
  components: {
    Button: {
      colorText: 'white',
    },
    Input: {
      colorBgContainer: gray[6],
      colorBorder: gray[1],
      colorText: 'white',
    },
    Divider: {
      colorSplit: ACCENT_COLOR_RGB,
    },
  },
};

export default theme;
