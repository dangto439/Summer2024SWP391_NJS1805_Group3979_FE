import { useState, useEffect } from "react";
import { Button, Col, Row, DatePicker, Table, message, Input } from "antd";
import moment from "moment";
import api from "../../config/axios";
import { toast } from "react-toastify";
import "./index.scss";
import { useNavigate } from "react-router-dom";

function BookingDaily({ clubID }) {
  const [selectedDate, setSelectedDate] = useState(moment());
  const [dataSource, setDataSource] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [totalHours, setTotalHours] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [columns, setColumns] = useState([]);
  const [promotionCode, setPromotionCode] = useState("");
  useEffect(() => {
    const fetchCourtsData = async () => {
      try {
        const courtsResponse = await api.get(`/courts/${clubID}`);
        const courts = courtsResponse.data;

        const slotsPromises = courts.map((court) =>
          api.get(`/court-slot/${court.courtId}`)
        );
        const slotsResponses = await Promise.all(slotsPromises);

        const slotsData = slotsResponses.flatMap((response) => response.data);

        const formattedData = slotsData.reduce((result, slot) => {
          const time = formatTime(slot.slotId);
          if (!result[time]) {
            result[time] = { time };
          }
          result[time][`court_${slot.courtResponse.courtId}`] = slot;
          return result;
        }, {});

        setDataSource(Object.values(formattedData));

        const generatedColumns = courts.map((court) => ({
          title: court.courtName,
          dataIndex: `court_${court.courtId}`,
          key: court.courtId,
          render: (slot) =>
            slot ? (
              <Button
                key={slot.courtSlotId}
                className={
                  selectedSlots.some(
                    (selectedSlot) =>
                      selectedSlot.courtSlotId === slot.courtSlotId
                  )
                    ? "selected-slot"
                    : ""
                }
                onClick={() => handleSlotSelect(slot)}
              >
                {formatTime(slot.slotId)}
              </Button>
            ) : null,
        }));

        setColumns(generatedColumns);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchCourtsData();
  }, [clubID, selectedSlots]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSlotSelect = (slot) => {
    const isSelected = selectedSlots.some(
      (selectedSlot) => selectedSlot.courtSlotId === slot.courtSlotId
    );
    const updatedSlots = isSelected
      ? selectedSlots.filter(
          (selectedSlot) => selectedSlot.courtSlotId !== slot.courtSlotId
        )
      : [...selectedSlots, slot];

    setSelectedSlots(updatedSlots);
    calculateTotal(updatedSlots);
  };

  const calculateTotal = (slots) => {
    const hours = slots.length;
    const price = slots.reduce((sum, slot) => sum + slot.price, 0);

    setTotalHours(hours);
    setTotalPrice(price);
  };

  const handleWallet = async (values) => {
    try {
      const response = await api.post(`/vnpay?amount=${values}`);
      const paymentLink = response.data;
      window.location.href = paymentLink;
    } catch (error) {
      toast.error("Không thể thanh toán!");
    }
  };

  const handleSubmit = async () => {
    if (selectedSlots.length === 0) {
      message.warning("Vui lòng chọn ít nhất một slot.");
      return;
    }

    const bookingData = {
      bookingDetailRequests: selectedSlots.map((slot) => ({
        courtSlotId: slot.courtSlotId,
        playingDate: selectedDate.format("YYYY-MM-DD"),
      })),
      promotionCode: promotionCode,
      flexibleBookingId: 0,
    };

    try {
      // Thanh Toán
      handleWallet(totalPrice);
      //Đặt sân
      const booking = await api.post("/booking/daily", bookingData);
      message.success("Đặt sân thành công!");
    } catch (error) {
      console.error("Error submitting booking:", error);
      message.error("Đặt sân thất bại. Vui lòng thử lại.");
    }
  };

  const disabledDate = (current) => {
    return current && current < moment().startOf("day");
  };

  const formatTime = (slotId) => {
    const hours = Math.floor(slotId);
    return `${hours}:00`;
  };

  const handleInputChange = (e) => {
    setPromotionCode(e.target.value);
  };

  return (
    <Row className="booking-daily">
      <Col span={7} className="booking-daily-sidebar">
        <Row>
          <Col span={24} className="booking-daily-datepicker-container">
            <DatePicker
              value={selectedDate}
              onChange={handleDateChange}
              disabledDate={disabledDate}
            />
          </Col>
          <Col span={24} className="booking-daily-summary">
            <h1>Sân cầu lông Cao Lỗ</h1>
            <h1>Ngày: {selectedDate.format("DD/MM/YYYY")}</h1>
            <h1>Tổng giờ: {totalHours} giờ</h1>
            <h1>Tổng Tiền: {totalPrice} VND</h1>
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
            <Button
              className="booking-daily-submit-button"
              onClick={handleSubmit}
            >
              THANH TOÁN
            </Button>
          </Col>
        </Row>
      </Col>
      <Col span={17} className="booking-daily-main">
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          rowKey="time"
        />
      </Col>
    </Row>
  );
}

export default BookingDaily;