import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Container } from "@mui/system";
import {
  Box,
  Divider,
  Typography,
} from "@mui/material";
import apple from "../../../mock_data/images/apple.jpg";
import {ReactComponent as MsgIcon} from "../../../assets/Order/message.svg";
import {ReactComponent as PhoneIcon} from "../../../assets/Order/phone.svg";
import {ReactComponent as AddressIcon} from "../../../assets/Order/address.svg"
import {ReactComponent as LeftArrow} from "../../../assets/Order/leftarrow.svg"
import {ReactComponent as Flag} from "../../../assets/Order/flag.svg"

import { UserContext } from "../../../context/user/user-context";
import { useProducts } from "../../../context/product/product-handler";
import OrderItem from "../CurrentOrder/OrderItem";
import { convertToDollar } from "../../../helper/convertToDollar";
import { selectedOrderStyles } from "../CurrentOrder/muiStyles";
import { universalOrderStyles } from "../muiStyles";
import ProgressTracker from "../OrderView/ProgressTracker";
import { convertUnixToTime } from '../../../helper/time'

function Order() {
  const { state } = useContext(UserContext);
  const { pastOrders } = state;
  const { orderId } = useParams();
  const products = useProducts();
  const [selectedOrder, setSelectedOrder] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setSelectedOrder(pastOrders ? (pastOrders).filter(order => order.id === orderId)[0] : []);
  }, [pastOrders]);

  const selectedOrderItems = [];
  let itemNumber = 1;
  selectedOrder.items?.map(({ product_id, quantity }) => {
    const product = products.find(({ id }) => id === product_id);
    const productComponent = (
      <OrderItem
        key={product.id}
        number={itemNumber}
        price={product.prices[0].unit_amount}
        taxRate={parseFloat(product.metadata.tax) / 100}
        desc={product.description}
        name={product.name}
        photo={product.images}
        quantity={parseInt(quantity)}
      />
    );
    selectedOrderItems.push(productComponent)
    itemNumber++
  })

  const getSubTotal = () => {
    let subTotal = 0;
    selectedOrderItems?.forEach((item) => {
      subTotal += item.props.price * item.props.quantity;
    });
    return subTotal;
  };

  const getTax = () => {
    let taxTotal = 0;
    selectedOrderItems?.forEach((item) => {
      taxTotal += item.props.price * item.props.quantity * item.props.taxRate;
    });
    return Math.round(taxTotal);
  };

  const getDeliveryFee = () => {
    const shippingFee = products.find((item) => item.id === "shipping_fee");
    return parseFloat(shippingFee?.price);
  };

  const getRusherTip = () => {
    const rusherTip = selectedOrder?.rusher_tip;
    return parseFloat(rusherTip);
  }

  const getTotal = () => {
    return getSubTotal() + getTax() + getDeliveryFee();
  };

  const getShippingAddress = () => {
    const building = selectedOrder?.shipping_address?.building
    const campus = selectedOrder?.shipping_address?.campus
    const floor_apartment = selectedOrder?.shipping_address?.floor_apartment

    return <Typography 
            sx={{
              fontWeight: "500",
              fontFamily: "Inter",
              fontSize: "16px",
              color: "#000000"
            }}
           >{`${building} ${floor_apartment}`} <br /> {campus} </Typography>;
  }

  return (
    <Box sx={{ paddingBottom: "100px" }}>
      <Box
        sx={{
          display: "flex",
          margin: "30px 25px 20px 25px",
          gap: "15px",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      > 
        <Box
          onClick={() => navigate('../../order')}
        >
          <LeftArrow />
        </Box>
        <Typography 
          variant="Mobile Title 1"
          sx={{
            fontWeight: "500",
            fontSize: "28px",
            width: "390px"
          }}
        >
          Order Details
        </Typography>
      </Box>
      {/* Current order details */}
      <Divider
        sx={{ borderBottomWidth: "4px", width: "100%" }}
      />

      <Container maxWidth="sm" sx={{padding: "0 25px"}}>
        {/* Order */}
        <Box 
          sx={{ 
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "Poppins",
            padding: "25px 0 0 0"
        }}>
          <Typography
            sx={{
              fontWeight: "600",
              color: "#586DD0",
              fontSize: "22px"
            }}
          >
            {`#${selectedOrder.id && (selectedOrder.id).substring(3, 9)} (${selectedOrderItems.length} items)`}
          </Typography>
          <Box
            sx={{
              // position: "absolute"
            }}
          >
            <Flag />
          </Box>
        </Box>
        <Typography 
          variant="body1"
          fontSize="large" 
          sx={{ 
            my: "10px",
            fontFamily: "Poppins",
            color: "#000000",
            fontWeight: "600",
            fontSize: "16px"
        }}>
          <b style={{color: "#000000"}}>Complete •</b> <span style={{fontWeight: "400"}}>{convertUnixToTime(selectedOrder.order_time)}</span>
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            my: "20px",
            padding: "0 10px",
            gap: "6px",
          }}
        >
          {selectedOrderItems.map((item) => {
            return item;
          })}
        </Box>
        {/* Completed order information */}
        <Box>
          {/* Totals */}
          <Divider
            flexItem="true"
            light="false"
            variant="fullWidth"
            sx={{ borderBottomWidth: "2px", my: "15px" }}
          />
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              color: "#686868",
              marginBottom: "10px"
            }}
          >
            <Typography 
              sx={{
                color: "#686868",
                fontFamily: "Inter",
                fontWeight: "600",
                fontSize: "22px"
              }}>
              Order Summary
            </Typography>
          </Box>
          <Box
            sx={{
              width: "100%",
              height: "30px",
              display: "flex",
              justifyContent: "space-between",
              color: "#686868",
            }}
          >
            <Typography 
              sx={selectedOrderStyles.selectedOrderSummary}
            >
              Subtotal
            </Typography>
            <Typography 
              sx={selectedOrderStyles.selectedOrderSummary}
            >
              ${convertToDollar(getSubTotal())}
            </Typography>
          </Box>
          <Box
            sx={{
              width: "100%",
              height: "30px",
              display: "flex",
              justifyContent: "space-between",
              color: "#686868",
            }}
          >
            <Typography
              sx={selectedOrderStyles.selectedOrderSummary}
            >
              Tax
            </Typography>
            <Typography
              sx={selectedOrderStyles.selectedOrderSummary}
            >
              ${convertToDollar(getTax())}
            </Typography>
          </Box>
          <Box
            sx={{
              width: "100%",
              height: "30px",
              display: "flex",
              justifyContent: "space-between",
              color: "#686868",
            }}
          >
            <Typography
              sx={selectedOrderStyles.selectedOrderSummary}
            >
              Delivery
            </Typography>
            <Typography
              sx={selectedOrderStyles.selectedOrderSummary}
            >
              ${convertToDollar(getDeliveryFee())}
            </Typography>
          </Box>
          <Box
            sx={{
              width: "100%",
              height: "30px",
              display: "flex",
              justifyContent: "space-between",
              color: "#686868",
            }}
          >
            <Typography
              sx={selectedOrderStyles.selectedOrderSummary}
            >
              Rusher Tip
            </Typography>
            <Typography
              sx={selectedOrderStyles.selectedOrderSummary}
            >
              ${convertToDollar(getRusherTip())}
            </Typography>
          </Box>
          <Box
            sx={{
              width: "100%",
              height: "30px",
              display: "flex",
              justifyContent: "space-between",
              color: "#686868",
            }}
          >
            <Typography
              sx={selectedOrderStyles.selectedOrderTotal}
            >
              Total
            </Typography>
            <Typography
              sx={selectedOrderStyles.selectedOrderTotal}
            >
              ${convertToDollar(getTotal())}
            </Typography>
          </Box>

          {/* Address */}
          <Divider
            sx={{ borderBottomWidth: "2px", my: "15px" }}
          />
          <Box
            sx={selectedOrderStyles.orderDetailsSection}
          >
            <Typography 
              sx={{
                color: "#686868",
                fontFamily: "Inter",
                fontWeight: "600",
                fontSize: "22px"
              }}>
              Address
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between"
            }}
          >
            {getShippingAddress()}
            <AddressIcon />
          </Box>
        </Box>
        {/* Replacement preference info */}
        <Divider
          sx={{ borderBottomWidth: "2px", my: "15px" }}
        />
        <Box
            sx={selectedOrderStyles.orderDetailsSection}
          >
            <Typography 
              sx={{
                color: "#686868",
                fontFamily: "Inter",
                fontWeight: "600",
                fontSize: "22px"
              }}>
              Replacement Preference
            </Typography>
          </Box>
        {/* special delivery instructions */}
        <Divider
          sx={{ borderBottomWidth: "2px", my: "15px" }}
        />
        <Box
            sx={selectedOrderStyles.orderDetailsSection}
          >
            <Typography 
              sx={{
                color: "#686868",
                fontFamily: "Inter",
                fontWeight: "600",
                fontSize: "22px"
              }}>
              Special Delivery Instructions
            </Typography>
          </Box>
        {/* Progress info */}
        <Divider
          sx={{ borderBottomWidth: "2px", my: "15px" }}
        />
        <Box
            sx={selectedOrderStyles.orderDetailsSection}
          >
            <Typography 
              sx={{
                color: "#686868",
                fontFamily: "Inter",
                fontWeight: "600",
                fontSize: "22px"
              }}>
              Progress
            </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <ProgressTracker processingStage={3} iconPadding={"0"} textPadding={"0 5px 0 1px"}/>
        </Box>
        {/* Rusher info */}
        <Divider
          sx={{ borderBottomWidth: "2px", my: "15px" }}
        />
        <Box
            sx={selectedOrderStyles.orderDetailsSection}
          >
            <Typography 
              sx={{
                color: "#686868",
                fontFamily: "Inter",
                fontWeight: "600",
                fontSize: "22px"
              }}>
              Rusher
            </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            my: "20px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <img style={{width: "50px", height: "50px", borderRadius: "50%"}} alt="Apple" width="60px" src={apple} />
            <Typography
              sx={{
                fontFamily: "Inter",
                fontWeight: "400",
                fontSize: "22px",
              }}
            >
              Alex G
            </Typography>
          </Box>

          <Box 
            sx={{ 
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px"
            }}
          >
            {/* phone number and text numbers below to be changed to actual values */}
            <Box
              sx={universalOrderStyles.contactButtons}
              onClick = {(e) => {
                e.stopPropagation()
                window.open('tel:900300400', '_self')
              }}
            >
              <PhoneIcon fill="#7C91F426"/>
            </Box>
            <Box
              sx={universalOrderStyles.contactButtons}
              onClick = {(e) => {
                e.stopPropagation()
                window.open('sms:900300400', '_self')
              }}
            >
              <MsgIcon fill="#7C91F426"/>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Order;