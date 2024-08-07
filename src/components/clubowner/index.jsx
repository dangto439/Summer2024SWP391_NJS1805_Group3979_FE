import { AiOutlineBuild, AiOutlineDollarCircle } from "react-icons/ai";
import { MdSupervisorAccount } from "react-icons/md";
import { GiTennisCourt } from "react-icons/gi";

import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import "./index.scss";
import { useEffect, useState } from "react";
import api from "../../config/axios";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/features/counterSlice";
import ViewTransaction from "../viewtransaction/viewtransaction";

function ClubOwnerDasboard() {
  const user = useSelector(selectUser); // lấy account hiện tại từ redux;

  const [totalPrice, setTotalPrice] = useState(0);
  const [bookingNumber, setBookingNumber] = useState(0);
  const [clubNumber, setClubNumber] = useState(0);
  const [courtNumber, setCourtNumber] = useState(0);
  const [dataTransaction, setTransaction] = useState([]);
  const [bookingDataChart, setBookingDataChart] = useState([]);
  const [priceDataChart, setPrriceDataChart] = useState([]);

  const fetchData = async () => {
    try {
      const [
        totalPriceResponse,
        transactionResponse,
        clubsResponse,
        CoursResponse,
        bookingDataChartResponse,
        priceInDataChartesponse,
        priceOutDataChartesponse,
      ] = await Promise.all([
        api.get(`/wallet/${user.id}`),
        api.get(`get-transactions/${user.id}`),
        api.get(`/current-clubs`), //lấy số lượng sân hiện tại của account
        api.get(`/courts/amount`),
        api.get(`/dashboard-club-chart-account/${user.id}`),
        api.get(`/dashboard-club-area-chart?walletId=${user.id}&year=2024`), //tiền vào
        api.get(
          `/dashboard-club-area-chart-refund?walletId=${user.id}&year=2024`
        ), //tiền ra
      ]);

      const totalSumAmount = bookingDataChartResponse.data.reduce(
        (accumulator, currentValue) => {
          return accumulator + currentValue.sumamount;
        },
        0
      );

      setTotalPrice(totalPriceResponse.data.balance);
      setTransaction(transactionResponse.data);
      setBookingNumber(totalSumAmount);
      setClubNumber(clubsResponse.data.length);
      setCourtNumber(CoursResponse.data);
      const confirmDataBookingChart = bookingDataChartResponse.data.map(
        (item) => ({
          name: `Thang ${item.month}`,
          soluongdatlich: item.sumamount,
        })
      );
      setBookingDataChart(confirmDataBookingChart);
      const confirmDataPriceInChart = priceInDataChartesponse.data.map(
        (item) => ({
          name: `Thang ${item.month}`,
          tienvao: item.sumamount,
        })
      );
      const confirmDataPriceOutChart = priceOutDataChartesponse.data.map(
        (item) => ({
          tienra: item.sumamount,
        })
      );
      const mergedDataChart = confirmDataPriceInChart.map((item, index) => ({
        ...item,
        ...confirmDataPriceOutChart[index],
      }));
      setPrriceDataChart(mergedDataChart);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <main className="main-container-clubowner">
      <div className="main-ttile">
        <h3>Dashboard</h3>
      </div>

      <div className="main_cards">
        <div className="card orange">
          <div className="card_inner">
            <h3>Câu lạc bộ</h3>
            <AiOutlineBuild className="card_icon" />
          </div>
          <h1>{clubNumber}</h1>
        </div>
        <div className="card purple">
          <div className="card_inner">
            <h3>Sân</h3>
            <GiTennisCourt className="card_icon" />
          </div>
          <h1>{courtNumber}</h1>
        </div>
        <div className="card blue">
          <div className="card_inner ">
            <h3>Số lượng đơn đặt sân</h3>
            <MdSupervisorAccount className="card_icon" />
          </div>
          <h1>{bookingNumber}</h1>
        </div>
        <div className="card red">
          <div className="card_inner ">
            <h3>Tổng tiền</h3>
            <AiOutlineDollarCircle className="card_icon" />
          </div>
          <h1>{formatCurrency(totalPrice)}</h1>
        </div>
        <div className="charts">
          <ResponsiveContainer width="100%" height={500}>
            <BarChart
              width={500}
              height={300}
              data={priceDataChart}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="tienvao"
                fill="#8884d8"
                activeBar={<Rectangle fill="pink" stroke="blue" />}
              />
              <Bar
                dataKey="tienra"
                fill="#82ca9d"
                activeBar={<Rectangle fill="gold" stroke="purple" />}
              />
            </BarChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart
              width={500}
              height={300}
              data={bookingDataChart}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="soluongdatlich"
                fill="#8884d8"
                activeBar={<Rectangle fill="pink" stroke="blue" />}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div>
        <ViewTransaction data={dataTransaction} />
      </div>
    </main>
  );
}

export default ClubOwnerDasboard;
