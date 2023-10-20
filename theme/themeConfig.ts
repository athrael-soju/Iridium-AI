import { gray } from '@ant-design/colors';

import type { ThemeConfig } from 'antd';

const theme: ThemeConfig = {
  token: {
    fontSize: 16,
    colorPrimary: gray[6],
  },
  components: {
    Input: {
      colorBgContainer: gray[6],
      colorBorder: gray[1],
      colorText: 'white',
    },
  },
};

export default theme;
