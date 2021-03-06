import React, { Component } from 'react';
import { Alert, Button, Drawer, Input, Form } from 'antd';
import { getCurrentBucket } from '../../../../util/Bucket';
import { CreateFolderApi } from '../../../../api/object';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    s: { span: 5 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    s: { span: 19 },
    sm: { span: 19 },
  },
};

export default class AddFolderDrawer extends Component {
  static displayName = 'AddFolderDrawer';

  formRef = React.createRef();

  constructor(props) {
    super(props);
    const bucketInfo = getCurrentBucket();
    this.state = {
      currentPath: this.props.currentPath,
      objectName: '',
      bucketInfo,
      submitLoading: false,
    };
  }

  validateFolder = (rule, value) => {
    if (!value || value.trim().length < 2 || value.trim().length > 254) {
      return Promise.reject(
        <span style={{
          fontSize: '12px',
          color: 'red',
        }}
        >
        2-254个字符长度
        </span>,
      );
    }
    if (value.indexOf('//') !== -1) {
      return Promise.reject(
        <span style={{
          fontSize: '12px',
          color: 'red',
        }}
        >
        目录路径不允许出现连续的「/」
        </span>,
      );
    }
    if (value.startsWith('/') || value.startsWith('\\') || value.endsWith('/') || value.endsWith('\\')) {
      return Promise.reject(
        <span style={{
          fontSize: '12px',
          color: 'red',
        }}
        >
        文件名不能以
          <code>/</code>
        或
          <code>\</code>
        开头和结尾。
        </span>,
      );
    }
    if (!/^[^/]((?!\/\/)(?!\\)[（）\\(\\)a-zA-Z0-9/\-_\u4E00-\u9FA5])*[^/]$/.test(value)) {
      return Promise.reject(
        <span
          style={{
            fontSize: '12px',
            color: 'red',
          }}
        >
          目录仅支持数字字母中文短横线下划线,中英文小括号和
          <code>/</code>
          字符
        </span>,
      );
    }
    this.setState({
      objectName: value,
    });
    return Promise.resolve();
  };

  createFolderSubmit = async (values) => {
    await this.setState({
      submitLoading: true,
    });
    const { bucketInfo, currentPath } = this.state;
    const params = {
      bucket: bucketInfo.name,
      folder: currentPath === '/' ? values.objectName : `${currentPath.substr(1)}/${values.objectName}`,
    };
    CreateFolderApi(params)
      .then((res) => {
        if (res.msg === 'SUCCESS') {
          this.props.onSuccess();
          this.props.onClose();
        }
      })
      .catch((error) => {
        console.error(error);
      });
    this.setState({
      submitLoading: false,
    });
  };

  render() {
    const { submitLoading, objectName } = this.state;
    return (
      <Drawer
        width={640}
        placement="right"
        closable
        maskClosable={false}
        onClose={this.props.onClose}
        visible={this.props.visible}
        className="oss-drawer"
        title="新建目录"
      >
        <Form
          ref={this.formRef}
          {...formItemLayout}
          className="add-folder-form"
          onFinish={this.createFolderSubmit}
          initialValues={objectName}
        >
          <Form.Item
            name="objectName"
            label="目录名"
            extra={folderHelpMessage}
            rules={[
              {
                validator: this.validateFolder,
              },
            ]}
          >
            <Input placeholder="相对当前目录" suffix={`${objectName.length}/254`} />
          </Form.Item>
          <div className="form-btn">
            <Button
              loading={submitLoading}
              type="primary"
              htmlType="submit"
              style={{
                marginRight: 8,
              }}
              disabled={!objectName}
            >
              确认
            </Button>
            <Button onClick={this.props.onClose}>
              取消
            </Button>
          </div>
        </Form>
      </Drawer>
    );
  }
}

const folderHelpMessage = (
  <div className="upload-help-info">
    <div className="oss-intl-lines">
      <p>目录命名规范：</p>
      <ol>
        <li>不允许使用表情符，请使用符合要求的 UTF-8 字符</li>
        <li>
          <code>/</code>
          用于分割路径，可快速创建子目录，但不要以
          <code>/</code>
          或
          <code>\</code>
          打头，不要出现连续的
          <code>/</code>
        </li>
        <li>
          不允许出现名为
          <code>..</code>
          的子目录
        </li>
        <li>总长度控制在 1-254 个字符</li>
      </ol>
    </div>
    <Alert message="注意，Bucket 下若存在同名目录，将会忽略。" type="warning" showIcon />
  </div>
);
