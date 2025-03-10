import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";



//HOME 
import HomePage from "./Home/Home";
import HomePage2 from "./Home/Loggedhome";

// Admin Panel
import AdminPanel from "./adminPanel/AdminPanel";

//crop management
import AddCrop from "./cropManagement/pages/AddCrop";
import CropList from "./cropManagement/pages/CropList";
import CropDetails from './cropManagement/pages/CropDetails';
import EditCrop from './cropManagement/pages/EditCrop';


// Inventory Panel
import Home from "./inventoryControl/pages/Home";
import AddItems from "./inventoryControl/pages/AddItems";
import UpdateItemPage from "./inventoryControl/pages/UpdateItemPage";
import Shop from "./inventoryControl/pages/shop";
import ItemDetailPage from "./inventoryControl/pages/ItemDetailPage";
import Cart from "./inventoryControl/pages/Cart";
import Checkout from "./inventoryControl/pages/Checkout";

//payment
import ViewPayment from "./PaymentManagement/pages/ViewPayments";
import Payment from "./PaymentManagement/pages/Payment";
import PaymentDetail from './PaymentManagement/pages/PaymentDetail';

// Feedback Panel
import FeedBack from "./feedbackPanel/pages/Feedback";
import AdminTableFeedback from "./feedbackPanel/pages/AdminTableFeedback";
import AskQuestion from "./feedbackPanel/pages/Question";
import UserTable from "./feedbackPanel/pages/UserTable";

// Marketing Panel
import Promotion from "./marketingPanel/pages/Promotion";
import PromotionTable from "./marketingPanel/pages/PromotionTable";
import Promotionview from "./marketingPanel/pages/PromotionView";
import Promotionmain from "./marketingPanel/pages/main";
import PromotionDetail from "./marketingPanel/pages/PromotionDetail";
import MarketingHome from "./marketingPanel/pages/Home";
import ShopEdit from "./marketingPanel/pages/shopEdit";



const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/adminpanel" element={<AdminPanel />} />

     
      <Route path="/home" element={<HomePage2 />} />
      <Route path="/" element={<HomePage />} />


      {/* Inventory Panel */}

      <Route path="/inventoryPanel" element={<Home />} />
      <Route path="/inventoryPanel/addItems" element={<AddItems />} />
      <Route path="/inventoryPanel/item/:id" element={<UpdateItemPage />} />
      <Route path="/inventoryPanel/shop" element={<Shop />} />
      <Route path="/item/:itemID" element={<ItemDetailPage />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/checkout/:cart" element={<Checkout />} />

      
    
      <Route path="/paymentview" element={<ViewPayment />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/payment/:id" element={<PaymentDetail />} />

      {/* Feedback Panel */}
      <Route path="/feedbackPanel" element={<FeedBack />} />
      <Route path="/feedbackPanel/feedbackTable" element={<AdminTableFeedback />} />
      <Route path="/feedbackPanel/askQuestion" element={<AskQuestion />} />
      <Route path="/feedbackPanel/userTable" element={<UserTable />} />

      {/* Marketing Panel */}
      <Route path="/marketingPanel" element={<Promotionmain />} />
      <Route path="/marketingPanel/promotionmain" element={<Promotion />} />
      <Route path="/marketingPanel/promotionTable" element={<PromotionTable />} />
      <Route path="/marketingPanel/promotionview" element={<Promotionview />} />
      <Route path="/marketingPanel/promotion/:id" element={<PromotionDetail />} />
      <Route path="/marketingPanel/home" element={<MarketingHome />} />
      <Route path="/marketingPanel/shopEdit/:id" element={<ShopEdit />} />
   
      
      

      {/* Crop Management */}
      <Route path="/add-crop" element={<AddCrop />} />
      <Route path="/crop-list" element={<CropList />} />
      <Route path="/crop/:id" element={<CropDetails />} />
      <Route path="/edit-crop/:id" element={<EditCrop />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
