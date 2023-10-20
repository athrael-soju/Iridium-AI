import { gray } from '@ant-design/colors';

import type { ThemeConfig } from 'antd';

// Token Name	Description	Type	Default Value
// activeBg	Background color when the input box is activated	string
// activeBorderColor	Active border color	string	#1677ff
// activeShadow	Box-shadow when active	string	0 0 0 2px rgba(5, 145, 255, 0.1)
// addonBg	Background color of addon	string	rgba(0, 0, 0, 0.02)
// errorActiveShadow	Box-shadow when active in error status	string	0 0 0 2px rgba(255, 38, 5, 0.06)
// hoverBg	Background color when the input box hovers	string
// hoverBorderColor	Hover border color	string	#4096ff
// paddingBlock	Vertical padding of input	number	4
// paddingBlockLG	Vertical padding of large input	number	7
// paddingBlockSM	Vertical padding of small input	number	0
// paddingInline	Horizontal padding of input	number	11
// paddingInlineLG	Horizontal padding of large input	number	11
// paddingInlineSM	Horizontal padding of small input	number	7
// warningActiveShadow	Box-shadow when active in warning status	string	0 0 0 2px rgba(255, 215, 5, 0.1)

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
