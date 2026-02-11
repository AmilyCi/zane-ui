export interface ChatBodyThemes {
  /**
   * 背景颜色
   */
  color: string;
  /**
   * 背景过滤器，用于模糊背景图片等效果。例如：blur(5px)
   */
  backdropFilter: string;
  /**
   * 宽度
   */
  width: string;
  /**
   * 最大宽度
   */
  maxWidth: string;
  /**
   * 内边距
   */
  padding: string;
  /**
   * 外边距
   */
  margin: string;
  /**
   * 去底部按钮样式配置
   */
  toBottomColor: string;
  /**
   * 去底部按钮大小
   */
  toBottomSize: string;
  /**
   * 去底部按钮边框半径
   */
  toBottomBorderRadius: string;
  /**
   * 去底部按钮鼠标经过背景颜色
   */
  toBottomColorHover: string;
  /**
   * 去底部按钮文字颜色
   */
  toBottomTextColor: string;
  /**
   * 去底部按钮鼠标经过文字颜色
   */
  toBottomTextColorHover: string;
  /**
   * 去底部按钮边框颜色
   */
  toBottomBorderColor: string;
  /**
   * 去底部按钮鼠标经过边框颜色
   */
  toBottomBorderColorHover: string;
}

export interface ChatBubbleThemes {
  /**
   * 发送消息气泡背景颜色。
   */
  sendColor: string;
  /**
   * 发送消息气泡文字颜色。
   */
  sendTextColor: string;
  /**
   * 回复消息气泡背景颜色。
   */
  respondColor: string;
  /**
   * 回复消息气泡文字颜色。
   */
  respondTextColor: string;
  /**
   * 头像大小。
   */
  avatarSize: string;
  /**
   * 头像间距。
   */
  avatarPadding: string;
  /**
   * 头像外边距。
   */
  avatarMargin: string;
  /**
   * 头像边框颜色。
   */
  avatarBorderColor: string;
  /**
   * 头像边框大小。
   */
  avatarBorderSize: string;
  /**
   * 头像阴影。
   */
  avatarBoxShadow: string;
  /**
   * 头像圆角。
   */
  avatarBorderRadius: string;
  /**
   * 消息气泡边框颜色。
   */
  borderColor: string;
  /**
   * 消息气泡边框大小。
   */
  borderSize: string;
  /**
   * 消息气泡阴影。
   */
  boxShadow: string;
  /**
   * 消息气泡圆角。
   */
  borderRadius: string;
  /**
   * 气泡内边距。
   */
  padding: string;
  /**
   * 气泡外边距。
   */
  margin: string;
  /**
   * 气泡背景模糊效果。
   */
  backdropFilter: string;
}

/**
 * 底部容器样式配置
 */
export interface ChatFooterThemes {
  /**
   * 底部容器背景颜色
   */
  color: string;
  /**
   * 底部容器文字颜色
   */
  textColor: string;
  /**
   * 底部容器文字大小
   */
  fontSize: string;
  /**
   * 底部容器内边距
   */
  padding: string;
}

/**
 * 聊天头部主题样式
 */
export interface ChatHeaderThemes {
  /**
   * 背景颜色
   */
  color: string;
  /**
   * 字体大小
   */
  fontSize: string;
  /**
   * 字体粗细
   */
  fontWeight: string;
  /**
   * 边框颜色
   */
  borderColor: string;
  /**
   * 边框大小
   */
  borderSize: string;
  /**
   * 边框圆角大小
   */
  borderRadius: string;
  /**
   * 阴影效果
   */
  boxShadow: string;
  /**
   * 内边距大小
   */
  padding: string;
  /**
   * 标题字体大小
   */
  titleFontSize: string;
  /**
   * 标题字体粗细
   */
  titleFontWeight: string;
  /**
   * 标题字体颜色
   */
  titleTextColor: string;
  /**
   * 副标题字体大小
   */
  subtitleTextColor: string;
  /**
   * 返回按钮的大小
   */
  backSize: string;
  /**
   * 返回按钮的颜色
   */
  backColor: string;
  /**
   * 返回按钮鼠标悬浮时的颜色
   */
  backColorHover: string;
  /**
   * 返回按钮鼠标按下时的颜色
   */
  backColorPressed: string;
}

/**
 * 消息输入容器主题
 */
export interface ChatInputThemes {
  /**
   * 消息输入容器背景颜色
   */
  color: string;
  /**
   * 消息输入容器背景模糊效果
   */
  backdropFilter: string;
  /**
   * 消息输入容器禁用背景颜色
   */
  colorDisabled: string;
  /**
   * 消息输入容器聚焦背景颜色
   */
  colorFocus: string;
  /**
   * 消息输入容器文本颜色
   */
  textColor: string;
  /**
   * 消息输入容器禁用文本颜色
   */
  textColorDisabled: string;
  /**
   * 消息输入容器聚焦文本颜色
   */
  textColorFocus: string;
  /**
   * 消息输入容器输入框内边距
   */
  inputPadding: string;
  /**
   * 消息输入容器输入框边框圆角
   */
  inputBorderRadius: string;
  /**
   * 消息输入容器输入框背景颜色
   */
  inputColor: string;
  /**
   * 消息输入容器输入框字体大小
   */
  inputFontSize: string;
  /**
   * 消息输入容器输入框字体粗细
   */
  inputFontWeight: string;
  /**
   * 消息输入容器输入框禁用背景颜色
   */
  inputColorDisabled: string;
  /**
   * 消息输入容器输入框文本颜色
   */
  inputTextColor: string;
  /**
   * 消息输入容器输入框禁用文本颜色
   */
  inputTextColorDisabled: string;
  /**
   * 消息输入容器输入框聚焦文本颜色
   */
  inputTextColorFocus: string;
  /**
   * 消息输入容器输入框占位符颜色
   */
  placeholderColor: string;
  /**
   * 消息输入容器输入框禁用占位符颜色
   */
  placeholderColorDisabled: string;
  /**
   * 消息输入容器宽度
   */
  width: string;
  /**
   * 消息输入容器最大宽度
   */
  maxWidth: string;
  /**
   * 消息输入容器高度
   */
  height: string;
  /**
   * 消息输入容器最大高度
   */
  maxHeight: string;
  /**
   * 消息输入容器边框颜色
   */
  border: string;
  /**
   * 消息输入容器边框悬停颜色
   */
  borderHover: string;
  /**
   * 消息输入容器边框禁用颜色
   */
  borderDisabled: string;
  /**
   * 消息输入容器边框聚焦颜色
   */
  borderFocus: string;
  /**
   * 消息输入容器字体大小
   */
  fontSize: string;
  /**
   * 消息输入容器字体行高
   */
  lineHeight: string;
  /**
   * 消息输入容器边框圆角
   */
  borderRadius: string;
  /**
   * 消息输入容器边框阴影
   */
  boxShadow: string;
  /**
   * 消息输入容器聚焦边框阴影
   */
  boxShadowFocus: string;
  /**
   * 消息输入容器禁用边框阴影
   */
  boxShadowDisabled: string;
  /**
   * 消息输入容器内边距
   */
  padding: string;
  /**
   * 消息输入容器外边距
   */
  margin: string;
}

export interface ChatRootThemes {
  /**
   * 动画贝塞尔函数，用于动画效果。
   */
  bezier: string;
  /**
   * 主要颜色。
   */
  primary: string;
  /**
   * 背景颜色。
   */
  color: string;
  /**
   *  边框颜色。
   */
  borderColor: string;
  /**
   * 边框大小。
   */
  borderSize: string;
  /**
   * 阴影效果。
   */
  boxShadow: string;
  /**
   * 边框圆角。
   */
  borderRadius: string;
  /**
   * 内边距。
   */
  padding: string;
}

/**
 * 主题样式配置。
 */
export interface ThemeTokens {
  /**
   * 根样式主题。
   */
  root: ChatRootThemes;
  /**
   * 头部样式主题。
   */
  header: ChatHeaderThemes;
  /**
   * 消息容器主题。
   */
  body: ChatBodyThemes;
  /**
   * 气泡主题。
   */
  bubble: ChatBubbleThemes;
  /**
   * 底部样式主题。
   */
  footer: ChatFooterThemes;
  /**
   * 消息输入容器主题
   */
  input: ChatInputThemes;
}

export interface ChatContext {
  theme: ThemeTokens;
}
