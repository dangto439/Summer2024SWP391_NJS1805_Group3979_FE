import { Button, Form, Input } from "antd";
import "./index.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import api from "../../config/axios";

function ForgetPassword() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgetPassword = async (values) => {
    try {
      setLoading(true);
      const response = await api.post("/forgot-password", {
        email: values.email,
      });
      console.log(response.data);
      toast.success("Password reset Email sent successfully!");
    } catch (error) {
      console.error(error.message);
      toast.error("Error sending password reset Email!");
    } finally {
      navigate("/login");
      setLoading(false);
    }
  };
  return (
    <div className="forget-password">
      <h1 className="forget-password__heading">Forgot Password</h1>
      <p className="forget-password__form-desc">Enter your email address</p>
      <div className="text-wrap">
        <div className="text-line"></div>
        <div className="text-line"></div>
      </div>
      <Form
        form={form}
        className="forget-password__form"
        labelCol={{
          span: 24,
        }}
        onFinish={handleForgetPassword}
      >
        <div className="form-group">
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Please input your E-mail!",
              },
            ]}
          >
            <Input
              id="email"
              placeholder="name@example.com"
              className="form-input"
            />
          </Form.Item>
        </div>

        <Button
          type="primary"
          htmlType="submit"
          className="form-btn"
          disabled={loading}
        >
          Reset Password
        </Button>
        <Link to="/login" className="form-link-login">
          Login
        </Link>

        <Link to="/register" className="form-link-register">
          Register
        </Link>
      </Form>
    </div>
  );
}

export default ForgetPassword;
