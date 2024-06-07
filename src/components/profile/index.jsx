import React from "react";
import "./index.scss";
import { Button, Form, Input, Modal, Radio } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";

function Profile() {
  const [form] = useForm();
  const { confirm } = Modal;
  const showConfirm = () => {
    confirm({
      title: "Are you sure?",
      icon: <ExclamationCircleFilled />,
      content: "Change your infomation",
      onOk() {
        console.log("OK");
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const resetChange = () => {
    form.resetFields();
  };
  return (
    <div className="container">
      <h1>Edit Profile</h1>
      <div className="profile-pic-container">
        <img
          src="https://allimages.sgp1.digitaloceanspaces.com/photographereduvn/2022/06/1654263156_418_Hinh-anh-hinh-nen-Minion-cute-de-thuong-Full-HD.jpg"
          alt="Profile Picture"
          className="profile-pic"
        />
      </div>
      <Form
        form={form}
        className="form"
        autoComplete="off"
        labelCol={{ span: 24 }}
      >
        <div className="form-group">
          <Form.Item label="Email" name="email">
            <Input
              readOnly
              id="email"
              placeholder="name@example.com"
              className="form-input"
            />
          </Form.Item>
        </div>

        <div className="form-group">
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your Name!",
              },
            ]}
          >
            <Input id="name" placeholder="Name" className="form-input" />
          </Form.Item>
        </div>

        <div className="form-group">
          <Form.Item
            label="Gender"
            name="gender"
            rules={[
              {
                required: true,
                message: "Please select your Gender!",
              },
            ]}
          >
            <Radio.Group id="gender" className="form-input">
              <Radio value="MALE">Male</Radio>
              <Radio value="FEMALE">Female</Radio>
              <Radio value="OTHERS">Other</Radio>
            </Radio.Group>
          </Form.Item>
        </div>

        <div className="form-group">
          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              {
                required: true,
                message: "Please input your Phone number!",
              },
              {
                pattern: /^\d{10}$/,
                message: "Please input a valid 10-digit phone number!",
              },
            ]}
          >
            <Input
              id="phone"
              placeholder="(+84) 123-456-789"
              className="form-input"
            />
          </Form.Item>
        </div>

        <div className="form-group">
          <Form.Item
            label="New Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
              {
                min: 6,
                message: "Password must be at least 6 characters long!",
              },
            ]}
          >
            <Input.Password
              id="password"
              placeholder="Password"
              className="form-input"
            />
          </Form.Item>
        </div>

        <div className="form-group">
          <Form.Item
            label="Confirm New Password"
            name="confirm-password"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "Please confirm your Password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              id="confirm-password"
              placeholder="Confirm Password"
              className="form-input"
            />
          </Form.Item>
        </div>
      </Form>
      <Button onClick={showConfirm} className="save-button">
        Lưu thay đổi
      </Button>

      <Button onClick={resetChange} className="cancel-button">
        Hủy
      </Button>
    </div>
  );
}

export default Profile;