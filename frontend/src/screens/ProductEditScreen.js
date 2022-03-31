import React, { useContext, useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Store } from "../Store";
import { getError } from "../utils";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Button from "react-bootstrap/Button";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };
    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true, errorUpload: "" };
    case "UPLOAD_SUCCESS":
      return {
        ...state,
        loadingUpload: false,
        errorUpload: "",
      };
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    default:
      return state;
  }
};
export default function ProductEditScreen() {
  const navigate = useNavigate();
  const params = useParams(); // /product/:id
  const { id: productId } = params;

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [eccn, setECCN] = useState("");
  const [hsCode, setHSCode] = useState("");
  const [taxCode, setTaxCode] = useState("");
  const [countryOfOrigin, setCountryOfOrigin] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/products/${productId}`);
        setName(data.name);
        setSlug(data.slug);
        setPrice(data.price);
        setImage(data.image);
        setImages(data.images);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setBrand(data.brand);
        setDescription(data.description);
        setECCN(data.eccn);
        setHSCode(data.hsCode);
        setTaxCode(data.taxCode);
        setCountryOfOrigin(data.countryOfOrigin);
        dispatch({ type: "FETCH_SUCCESS" });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [productId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        `/api/products/${productId}`,
        {
          _id: productId,
          name,
          slug,
          price,
          image,
          images,
          category,
          brand,
          countInStock,
          description,
          eccn,
          hsCode,
          taxCode,
          countryOfOrigin,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: "UPDATE_SUCCESS",
      });
      toast.success("Product updated successfully");
      navigate("/admin/products");
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "UPDATE_FAIL" });
    }
  };
  const uploadFileHandler = async (e, forImages) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      const { data } = await axios.post("/api/upload", bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: "UPLOAD_SUCCESS" });

      if (forImages) {
        setImages([...images, data.secure_url]);
      } else {
        setImage(data.secure_url);
      }
      toast.success("Image uploaded successfully. click Update to apply it");
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: "UPLOAD_FAIL", payload: getError(err) });
    }
  };
  const deleteFileHandler = async (fileName, f) => {
    console.log(fileName, f);
    console.log(images);
    console.log(images.filter((x) => x !== fileName));
    setImages(images.filter((x) => x !== fileName));
    toast.success("Image removed successfully. click Update to apply it");
  };
  return (
    <Container className="small-container">
      <Helmet>
        <title>Edit Product ${productId}</title>
      </Helmet>
      <h1>Edit Product {productId}</h1>

      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="slug">
            <Form.Label>Slug</Form.Label>
            <Form.Control
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Price</Form.Label>
            <Form.Control
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="image">
            <Form.Label>Image File</Form.Label>
            <Form.Control
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="imageFile">
            <Form.Label>Upload Image</Form.Label>
            <Form.Control type="file" onChange={uploadFileHandler} />
            {loadingUpload && <LoadingBox></LoadingBox>}
          </Form.Group>

          <Form.Group className="mb-3" controlId="additionalImage">
            <Form.Label>Additional Images</Form.Label>
            {images.length === 0 && <MessageBox>No image</MessageBox>}
            <ListGroup variant="flush">
              {images.map((x) => (
                <ListGroup.Item key={x}>
                  {x}
                  <Button variant="light" onClick={() => deleteFileHandler(x)}>
                    <i className="fa fa-times-circle"></i>
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Form.Group>
          <Form.Group className="mb-3" controlId="additionalImageFile">
            <Form.Label>Upload Additional Image</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => uploadFileHandler(e, true)}
            />
            {loadingUpload && <LoadingBox></LoadingBox>}
          </Form.Group>

          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="brand">
            <Form.Label>Brand</Form.Label>
            <Form.Control
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="countInStock">
            <Form.Label>Count In Stock</Form.Label>
            <Form.Control
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>
          <h2>Digital River fields</h2>
          <Form.Group className="mb-3" controlId="eccn">
            <Form.Label>ECCN</Form.Label>
            <Form.Control
              value={eccn}
              onChange={(e) => setECCN(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="hsCode">
            <Form.Label>HSCode</Form.Label>
            <Form.Control
              value={hsCode}
              onChange={(e) => setHSCode(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="taxCode">
            <Form.Label>taxCode</Form.Label>
            <Form.Select
              value={taxCode}
              onChange={(e) => setTaxCode(e.target.value)}
              required
            >
              <option value="">-- Select a Tax Code --</option>
              <optgroup label="Downloadable Goods (Non-Software)">
                <option value="4512.100">
                  4512.100 - Digital - Digital Image
                </option>
                <option value="55111509.12">
                  55111509.12 - Digital - Virtual Goods
                </option>
                <option value="55111512.100">
                  55111512.100 - Digital - Music
                </option>
                <option value="55111507.120">
                  55111507.120 - Digital - Electronic Newspapers (Includes
                  Subscriptions)
                </option>
                <option value="55111506.120">
                  55111506.120 - Digital - Electronic Magazines (Includes
                  Subscriptions)
                </option>
                <option value="55111513.120">
                  55111513.120 - Digital - Educational / Vocational Texts
                </option>
                <option value="55111502.120">
                  55111502.120 - Digital - eBooks
                </option>
              </optgroup>
              <optgroup label="Food, Beverage & Household">
                <option value="51191905">
                  51191905 - Digital - Non-Prescription Vitamins
                </option>
                <option value="5124">
                  5124 - Digital - Non-Prescription Drugs
                </option>
                <option value="47">
                  47 - Digital - Miscellaneous Supplies
                </option>
                <option value="50">50 - Digital - Food - General</option>
              </optgroup>
              <optgroup label="Physical Goods">
                <option value="531316.150">
                  531316.150 - Digital - Automatic Blood Pressure Monitors
                </option>
                <option value="52141545.100">
                  52141545.100 - Digital - Energy Star - Stove
                </option>
                <option value="4010.200">
                  4010.200 - Digital - Energy Star - Dehumidifier
                </option>
                <option value="4010.100">
                  4010.100 - Digital - Energy Star - Air Conditioner
                </option>
                <option value="40101609.100">
                  40101609.100 - Digital - Energy Star - Ceiling Fan
                </option>
                <option value="39101629.100">
                  39101629.100 - Digital - Energy Star - Light Bulbs
                </option>
                <option value="52141506.100">
                  52141506.100 - Digital - Energy Star - Freezer
                </option>
                <option value="52141501.100">
                  52141501.100 - Digital - Energy Star - Refrigerator
                </option>
                <option value="52141601.100">
                  52141601.100 - Digital - Energy Star - Washer
                </option>
                <option value="52141602.100">
                  52141602.100 - Digital - Energy Star - Dryer
                </option>
                <option value="52141505.100">
                  52141505.100 - Digital - Energy Star - Dishwasher
                </option>
                <option value="4321_S">
                  4321_S - Digital - Computer Supplies - Subscription
                </option>
                <option value="43211509">
                  43211509 - Digital - Mobile Devices
                </option>
                <option value="42">42 - Digital - Medical Equipment</option>
                <option value="4512">
                  4512 - Digital - Consumer Electronics (Photographic, Filming,
                  or Video Equipment)
                </option>
                <option value="52161500_C">
                  52161500_C - Digital - Consumer Electronics (T.V., Monitor,
                  Display) - Size (&gt;4"&lt;15")
                </option>
                <option value="52161500_B">
                  52161500_B - Digital - Consumer Electronics (T.V., Monitor,
                  Display) - Size (= or &gt;35")
                </option>
                <option value="52161500_A">
                  52161500_A - Digital - Consumer Electronics (T.V., Monitor,
                  Display) - Size (= or &gt;15"&lt;35")
                </option>
                <option value="601410">
                  601410 - Digital - Video Game Consoles and Accessories
                </option>
                <option value="531027">531027 - Digital - Uniforms</option>
                <option value="49">
                  49 - Digital - Sports and Recreation Equipment
                </option>
                <option value="441216">
                  441216 - Digital - School Supplies
                </option>
                <option value="6010">
                  6010 - Digital - School Instructional Materials
                </option>
                <option value="461815.100">
                  461815.100 - Digital - Safety Clothing (Not Suitable for
                  Everyday Use)
                </option>
                <option value="5510">
                  5510 - Digital - Printed Media (Non-Subscription)
                </option>
                <option value="55101504.100">
                  55101504.100 - Digital - Newspapers (Includes Subscription)
                </option>
                <option value="55101506.100">
                  55101506.100 - Digital - Magazines (Includes Subscriptions)
                </option>
                <option value="601410">
                  601410 - Digital - General Merchandise
                </option>
                <option value="5216">
                  5216 - Digital - Consumer Electronics (Non-Computer)
                </option>
                <option value="4321_A">4321_A - Digital - Computers</option>
                <option value="4321_C">
                  4321_C - Digital - Computer Supplies
                </option>
                <option value="4321_B">
                  4321_B - Digital - Computer Peripheral Devices
                </option>
                <option value="55101510">
                  55101510 - Digital - Books - General Purpose
                </option>
                <option value="55101509">
                  55101509 - Digital - Books - Educational and Vocational Texts
                </option>
                <option value="53121603">53121603 - Digital - Backpacks</option>
                <option value="531029.100">
                  531029.100 - Digital - Apparel & Footwear (Everyday Use)
                </option>
                <option value="531029.200">
                  531029.200 - Digital - Apparel & Footwear (Athletic Use)
                </option>
              </optgroup>
              <optgroup label="Services & Miscellaneous">
                <option value="70.360">
                  70.360 - Digital - Installation Service Charges Provided by
                  the Seller of TPP
                </option>
                <option value="81112201.121">
                  81112201.121 - Digital - Mandatory Maintenance Agreements -
                  Services and Upgrades, Only for Downloadable
                </option>
                <option value="8111">8111 - Digital - Computer Services</option>
                <option value="70.60">
                  70.60 - Digital - Consulting Services
                </option>
                <option value="70.100">
                  70.100 - Digital - General Services
                </option>
                <option value="70.120">70.120 - Digital - Gift Cards</option>
                <option value="81112201.120">
                  81112201.120 - Digital - Mandatory Maintenance Agreements -
                  Services and Upgrades, for Downloadable and Physical Products
                </option>
                <option value="70.150">
                  70.150 - Digital - Non-warranty Repairs
                </option>
                <option value="811121">
                  811121 - Digital - Online Data Storage
                </option>
                <option value="81112201.420">
                  81112201.420 - Digital - Optional Maintenance Agreements -
                  Services and Upgrades, for Downloadable Products
                </option>
                <option value="81112201.410">
                  81112201.410 - Digital - Optional Maintenance Agreements -
                  Services and Upgrades, for Physical Products
                </option>
                <option value="81112201.200">
                  81112201.200 - Digital - Optional Maintenance Agreements -
                  Services Only, for Downloadable and Physical Products
                </option>
                <option value="70.300">
                  70.300 - Digital - Seminar Classes
                </option>
                <option value="70.280">
                  70.280 - Digital - Software Training
                </option>
                <option value="811118.100">
                  811118.100 - Digital - Technical Support
                </option>
                <option value="70.120_A">
                  70.120_A - Digital - Virtual Currency
                </option>
                <option value="70.220">
                  70.220 - Digital - Membership Dues - General
                </option>
                <option value="70.222">
                  70.222 - Digital - Membership Dues & Professional Organization
                </option>
                <option value="81112105">
                  81112105 - Digital - Web Hosting
                </option>
              </optgroup>
              <optgroup label="Software (Downloadable & Physical)">
                <option value="4323.310_B">
                  4323.310_B - Digital - Backup Media (CD/DVD) - One Disc per
                  Order
                </option>
                <option value="81112106">
                  81112106 - Digital - Software as a Service
                </option>
                <option value="4323.310_E">
                  4323.310_E - Digital - Physical Software (Gaming Only)
                </option>
                <option value="4323.310_A">
                  4323.310_A - Digital - Physical Software (Non-Gaming)
                </option>
                <option value="4323.310_D">
                  4323.310_D - Digital - Physical Media Kits
                </option>
                <option value="4323.310_C">
                  4323.310_C - Digital - Backup Media (CD/DVD) - One Disc per
                  Product
                </option>
                <option value="4323.320_C">
                  4323.320_C - Digital - Downloadable Media Kits
                </option>
                <option value="4323.320_D">
                  4323.320_D - Digital - Downloadable Software (Gaming Only)
                </option>
                <option value="4323.320_A">
                  4323.320_A - Digital - Downloadable Software (Non-Gaming,
                  Includes Software Subscriptions)
                </option>
                <option value="4323.320_B">
                  4323.320_B - Digital - Extended Download Service
                </option>
              </optgroup>
              <optgroup label="Software (Downloadable & Physical)">
                <option value="95.210">
                  95.210 - Digital - Optional Warranties - Purchased at Time of
                  Sale of for Consumer Goods, Labor Only
                </option>
                <option value="95.222">
                  95.222 - Digital - Optional Warranties - NOT Purchased at Time
                  of Sale of for Consumer Goods, Parts & Labor
                </option>
                <option value="95.220">
                  95.220 - Digital - Optional Warranties - NOT Purchased at Time
                  of Sale of for Consumer Goods, Labor Only
                </option>
                <option value="95.100">
                  95.100 - Digital - Mandatory Warranties
                </option>
                <option value="95.212">
                  95.212 - Digital - Optional Warranties - Purchased at Time of
                  Sale of for Consumer Goods, Parts & Labor
                </option>
              </optgroup>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="countryOfOrigin">
            <Form.Label>countryOfOrigin</Form.Label>
            <Form.Select
              value={countryOfOrigin}
              onChange={(e) => setCountryOfOrigin(e.target.value)}
              required
            >
              <option value="">-- Select Country of Origin --</option>
              <option value="AF">Afghanistan</option>
              <option value="AX">Åland Islands</option>
              <option value="AL">Albania</option>
              <option value="DZ">Algeria</option>
              <option value="AS">American Samoa</option>
              <option value="AD">Andorra</option>
              <option value="AO">Angola</option>
              <option value="AI">Anguilla</option>
              <option value="AQ">Antarctica</option>
              <option value="AG">Antigua and Barbuda</option>
              <option value="AR">Argentina</option>
              <option value="AM">Armenia</option>
              <option value="AW">Aruba</option>
              <option value="AU">Australia</option>
              <option value="AT">Austria</option>
              <option value="AZ">Azerbaijan</option>
              <option value="BS">Bahamas</option>
              <option value="BH">Bahrain</option>
              <option value="BD">Bangladesh</option>
              <option value="BB">Barbados</option>
              <option value="BY">Belarus</option>
              <option value="BE">Belgium</option>
              <option value="BZ">Belize</option>
              <option value="BJ">Benin</option>
              <option value="BM">Bermuda</option>
              <option value="BT">Bhutan</option>
              <option value="BO">Bolivia, Plurinational State of</option>
              <option value="BQ">Bonaire, Sint Eustatius and Saba</option>
              <option value="BA">Bosnia and Herzegovina</option>
              <option value="BW">Botswana</option>
              <option value="BV">Bouvet Island</option>
              <option value="BR">Brazil</option>
              <option value="IO">British Indian Ocean Territory</option>
              <option value="BN">Brunei Darussalam</option>
              <option value="BG">Bulgaria</option>
              <option value="BF">Burkina Faso</option>
              <option value="BI">Burundi</option>
              <option value="KH">Cambodia</option>
              <option value="CM">Cameroon</option>
              <option value="CA">Canada</option>
              <option value="CV">Cape Verde</option>
              <option value="KY">Cayman Islands</option>
              <option value="CF">Central African Republic</option>
              <option value="TD">Chad</option>
              <option value="CL">Chile</option>
              <option value="CN">China</option>
              <option value="CX">Christmas Island</option>
              <option value="CC">Cocos (Keeling) Islands</option>
              <option value="CO">Colombia</option>
              <option value="KM">Comoros</option>
              <option value="CG">Congo</option>
              <option value="CD">Congo, the Democratic Republic of the</option>
              <option value="CK">Cook Islands</option>
              <option value="CR">Costa Rica</option>
              <option value="CI">Côte d'Ivoire</option>
              <option value="HR">Croatia</option>
              <option value="CU">Cuba</option>
              <option value="CW">Curaçao</option>
              <option value="CY">Cyprus</option>
              <option value="CZ">Czech Republic</option>
              <option value="DK">Denmark</option>
              <option value="DJ">Djibouti</option>
              <option value="DM">Dominica</option>
              <option value="DO">Dominican Republic</option>
              <option value="EC">Ecuador</option>
              <option value="EG">Egypt</option>
              <option value="SV">El Salvador</option>
              <option value="GQ">Equatorial Guinea</option>
              <option value="ER">Eritrea</option>
              <option value="EE">Estonia</option>
              <option value="ET">Ethiopia</option>
              <option value="FK">Falkland Islands (Malvinas)</option>
              <option value="FO">Faroe Islands</option>
              <option value="FJ">Fiji</option>
              <option value="FI">Finland</option>
              <option value="FR">France</option>
              <option value="GF">French Guiana</option>
              <option value="PF">French Polynesia</option>
              <option value="TF">French Southern Territories</option>
              <option value="GA">Gabon</option>
              <option value="GM">Gambia</option>
              <option value="GE">Georgia</option>
              <option value="DE">Germany</option>
              <option value="GH">Ghana</option>
              <option value="GI">Gibraltar</option>
              <option value="GR">Greece</option>
              <option value="GL">Greenland</option>
              <option value="GD">Grenada</option>
              <option value="GP">Guadeloupe</option>
              <option value="GU">Guam</option>
              <option value="GT">Guatemala</option>
              <option value="GG">Guernsey</option>
              <option value="GN">Guinea</option>
              <option value="GW">Guinea-Bissau</option>
              <option value="GY">Guyana</option>
              <option value="HT">Haiti</option>
              <option value="HM">Heard Island and McDonald Islands</option>
              <option value="VA">Holy See (Vatican City State)</option>
              <option value="HN">Honduras</option>
              <option value="HK">Hong Kong</option>
              <option value="HU">Hungary</option>
              <option value="IS">Iceland</option>
              <option value="IN">India</option>
              <option value="ID">Indonesia</option>
              <option value="IR">Iran, Islamic Republic of</option>
              <option value="IQ">Iraq</option>
              <option value="IE">Ireland</option>
              <option value="IM">Isle of Man</option>
              <option value="IL">Israel</option>
              <option value="IT">Italy</option>
              <option value="JM">Jamaica</option>
              <option value="JP">Japan</option>
              <option value="JE">Jersey</option>
              <option value="JO">Jordan</option>
              <option value="KZ">Kazakhstan</option>
              <option value="KE">Kenya</option>
              <option value="KI">Kiribati</option>
              <option value="KP">Korea, Democratic People's Republic of</option>
              <option value="KR">Korea, Republic of</option>
              <option value="KW">Kuwait</option>
              <option value="KG">Kyrgyzstan</option>
              <option value="LA">Lao People's Democratic Republic</option>
              <option value="LV">Latvia</option>
              <option value="LB">Lebanon</option>
              <option value="LS">Lesotho</option>
              <option value="LR">Liberia</option>
              <option value="LY">Libya</option>
              <option value="LI">Liechtenstein</option>
              <option value="LT">Lithuania</option>
              <option value="LU">Luxembourg</option>
              <option value="MO">Macao</option>
              <option value="MK">
                Macedonia, the former Yugoslav Republic of
              </option>
              <option value="MG">Madagascar</option>
              <option value="MW">Malawi</option>
              <option value="MY">Malaysia</option>
              <option value="MV">Maldives</option>
              <option value="ML">Mali</option>
              <option value="MT">Malta</option>
              <option value="MH">Marshall Islands</option>
              <option value="MQ">Martinique</option>
              <option value="MR">Mauritania</option>
              <option value="MU">Mauritius</option>
              <option value="YT">Mayotte</option>
              <option value="MX">Mexico</option>
              <option value="FM">Micronesia, Federated States of</option>
              <option value="MD">Moldova, Republic of</option>
              <option value="MC">Monaco</option>
              <option value="MN">Mongolia</option>
              <option value="ME">Montenegro</option>
              <option value="MS">Montserrat</option>
              <option value="MA">Morocco</option>
              <option value="MZ">Mozambique</option>
              <option value="MM">Myanmar</option>
              <option value="NA">Namibia</option>
              <option value="NR">Nauru</option>
              <option value="NP">Nepal</option>
              <option value="NL">Netherlands</option>
              <option value="NC">New Caledonia</option>
              <option value="NZ">New Zealand</option>
              <option value="NI">Nicaragua</option>
              <option value="NE">Niger</option>
              <option value="NG">Nigeria</option>
              <option value="NU">Niue</option>
              <option value="NF">Norfolk Island</option>
              <option value="MP">Northern Mariana Islands</option>
              <option value="NO">Norway</option>
              <option value="OM">Oman</option>
              <option value="PK">Pakistan</option>
              <option value="PW">Palau</option>
              <option value="PS">Palestinian Territory, Occupied</option>
              <option value="PA">Panama</option>
              <option value="PG">Papua New Guinea</option>
              <option value="PY">Paraguay</option>
              <option value="PE">Peru</option>
              <option value="PH">Philippines</option>
              <option value="PN">Pitcairn</option>
              <option value="PL">Poland</option>
              <option value="PT">Portugal</option>
              <option value="PR">Puerto Rico</option>
              <option value="QA">Qatar</option>
              <option value="RE">Réunion</option>
              <option value="RO">Romania</option>
              <option value="RU">Russian Federation</option>
              <option value="RW">Rwanda</option>
              <option value="BL">Saint Barthélemy</option>
              <option value="SH">
                Saint Helena, Ascension and Tristan da Cunha
              </option>
              <option value="KN">Saint Kitts and Nevis</option>
              <option value="LC">Saint Lucia</option>
              <option value="MF">Saint Martin (French part)</option>
              <option value="PM">Saint Pierre and Miquelon</option>
              <option value="VC">Saint Vincent and the Grenadines</option>
              <option value="WS">Samoa</option>
              <option value="SM">San Marino</option>
              <option value="ST">Sao Tome and Principe</option>
              <option value="SA">Saudi Arabia</option>
              <option value="SN">Senegal</option>
              <option value="RS">Serbia</option>
              <option value="SC">Seychelles</option>
              <option value="SL">Sierra Leone</option>
              <option value="SG">Singapore</option>
              <option value="SX">Sint Maarten (Dutch part)</option>
              <option value="SK">Slovakia</option>
              <option value="SI">Slovenia</option>
              <option value="SB">Solomon Islands</option>
              <option value="SO">Somalia</option>
              <option value="ZA">South Africa</option>
              <option value="GS">
                South Georgia and the South Sandwich Islands
              </option>
              <option value="SS">South Sudan</option>
              <option value="ES">Spain</option>
              <option value="LK">Sri Lanka</option>
              <option value="SD">Sudan</option>
              <option value="SR">Suriname</option>
              <option value="SJ">Svalbard and Jan Mayen</option>
              <option value="SZ">Swaziland</option>
              <option value="SE">Sweden</option>
              <option value="CH">Switzerland</option>
              <option value="SY">Syrian Arab Republic</option>
              <option value="TW">Taiwan, Province of China</option>
              <option value="TJ">Tajikistan</option>
              <option value="TZ">Tanzania, United Republic of</option>
              <option value="TH">Thailand</option>
              <option value="TL">Timor-Leste</option>
              <option value="TG">Togo</option>
              <option value="TK">Tokelau</option>
              <option value="TO">Tonga</option>
              <option value="TT">Trinidad and Tobago</option>
              <option value="TN">Tunisia</option>
              <option value="TR">Turkey</option>
              <option value="TM">Turkmenistan</option>
              <option value="TC">Turks and Caicos Islands</option>
              <option value="TV">Tuvalu</option>
              <option value="UG">Uganda</option>
              <option value="UA">Ukraine</option>
              <option value="AE">United Arab Emirates</option>
              <option value="GB">United Kingdom</option>
              <option value="US">United States</option>
              <option value="UM">United States Minor Outlying Islands</option>
              <option value="UY">Uruguay</option>
              <option value="UZ">Uzbekistan</option>
              <option value="VU">Vanuatu</option>
              <option value="VE">Venezuela, Bolivarian Republic of</option>
              <option value="VN">Viet Nam</option>
              <option value="VG">Virgin Islands, British</option>
              <option value="VI">Virgin Islands, U.S.</option>
              <option value="WF">Wallis and Futuna</option>
              <option value="EH">Western Sahara</option>
              <option value="YE">Yemen</option>
              <option value="ZM">Zambia</option>
              <option value="ZW">Zimbabwe</option>
            </Form.Select>
          </Form.Group>
          <div className="mb-3">
            <Button disabled={loadingUpdate} type="submit">
              Update
            </Button>
            {loadingUpdate && <LoadingBox></LoadingBox>}
          </div>
        </Form>
      )}
    </Container>
  );
}
