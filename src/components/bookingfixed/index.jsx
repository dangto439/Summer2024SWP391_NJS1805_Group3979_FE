import moment from "moment/moment";
import "./index.scss";
import { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Input,
  Row,
  Table,
  message,
} from "antd";
import api from "../../config/axios";

function BookingFixed({ clubID }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [promotionCode, setPromotionCode] = useState("");

  const onChange = (date, dateString) => {
    setSelectedDate(date);
  };

  const disabledDate = (current) => {
    return current && current < moment().endOf("day");
  };

  const fetchSlots = async () => {
    const fetchedSlots = await api.get(`/court-slot/1`); // gắn tạm
    setSlots(fetchedSlots.data);
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleSlotSelect = (slotId) => {
    const updatedSelectedSlots = selectedSlots.includes(slotId)
      ? selectedSlots.filter((id) => id !== slotId)
      : [...selectedSlots, slotId];

    setSelectedSlots(updatedSelectedSlots);

    // Tính tiền
    const total = updatedSelectedSlots.reduce((sum, id) => {
      const slot = slots.find((slot) => slot.slotId === id);
      return sum + (slot ? slot.price : 0);
    }, 0);
    setTotalPrice(total);
  };

  const handleDayChange = (checkedValues) => {
    setSelectedDays(checkedValues);
  };

  const handleSubmit = async () => {
    if (!selectedDate) {
      message.warning("Vui lòng chọn thời gian.");
      return;
    }
    if (selectedSlots.length === 0) {
      message.warning("Vui lòng chọn ít nhất một slot.");
      return;
    }

    const bookingData = {
      year: selectedDate ? selectedDate.year() : 0,
      month: selectedDate ? selectedDate.month() + 1 : 0,
      clubId: clubID,
      promotionCode: promotionCode,
      dayOfWeeks: selectedDays,
      slotIds: selectedSlots,
    };

    try {
      // const booking = await api.post("/booking/fixed", bookingData);
      console.log(bookingData);

      message.success("Đặt sân thành công!");
    } catch (error) {
      console.error("Error submitting booking:", error);
      message.error("Đặt sân thất bại. Vui lòng thử lại.");
    }
  };

  const dayOptions = [
    { label: "Chủ nhật", value: 1 },
    { label: "Thứ hai", value: 2 },
    { label: "Thứ ba", value: 3 },
    { label: "Thứ tư", value: 4 },
    { label: "Thứ năm", value: 5 },
    { label: "Thứ sáu", value: 6 },
    { label: "Thứ bảy", value: 7 },
  ];

  const columns = [
    {
      title: "Time",
      dataIndex: "slotId",
      key: "slotId",
      render: (text, record) => (
        <div
          className={`slot-item ${
            selectedSlots.includes(record.slotId) ? "selected-slot" : ""
          }`}
          onClick={() => handleSlotSelect(record.slotId)}
        >
          {`${record.slotId}:00`}
        </div>
      ),
    },
  ];

  const handleInputChange = (e) => {
    setPromotionCode(e.target.value);
  };

  return (
    <Row className="booking-fixed">
      <Col span={7} className="booking-sidebar-fixed">
        <Row>
          <Col span={24} className="booking-summary-fixed">
            <h1>Sân cầu lông Cao Lỗ</h1>
            <h1>
              Thời gian đặt:{" "}
              {selectedDate ? selectedDate.format("MM/YYYY") : ""}
            </h1>
            <h1>Giá tiền tạm tính trên một ngày: {totalPrice} VND</h1>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/badminton-booking-platform.appspot.com/o/z5545153816126_834da2b1757f9fca8d39197a7ac64f93.jpg?alt=media&token=50c69782-7782-42c9-877d-c07a1e906abb"
              alt=""
            />
            <Input
              placeholder="Nhập mã khuyến mãi"
              variant="borderless"
              value={promotionCode}
              onChange={handleInputChange}
            />
            <Button className="submit-button-fixed" onClick={handleSubmit}>
              THANH TOÁN
            </Button>
          </Col>
        </Row>
      </Col>
      <Col span={17} className="booking-main-fixed">
        <DatePicker
          className="datepicker-fixed"
          onChange={onChange}
          disabledDate={disabledDate}
          picker="month"
        />
        <Checkbox.Group
          onChange={handleDayChange}
          options={dayOptions}
          style={{ marginTop: 20 }}
        />
        <div className="slots-container">
          {slots.map((slot) => (
            <div
              key={slot.slotId}
              className={`slot-item ${
                selectedSlots.includes(slot.slotId) ? "selected-slot" : ""
              }`}
              onClick={() => handleSlotSelect(slot.slotId)}
            >
              {`${slot.slotId}:00`}
            </div>
          ))}
        </div>
      </Col>
    </Row>
  );
}

export default BookingFixed;