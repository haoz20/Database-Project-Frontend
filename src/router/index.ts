import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import RolesView from "../views/RolesView.vue";
import SignUp from "@/views/SignUp.vue";
import AdminPage from "@/views/admin/AdminPage.vue";
import UsersManagement from "@/views/admin/UsersManagement.vue";
import IssuesView from "@/views/admin/IssuesView.vue";
import AnalyticsView from "@/views/admin/AnalyticsView.vue";
import CustomerPage from "@/views/customer/CustomerPage.vue";
import SearchView from "@/views/customer/SearchView.vue";
import BookingsPage from "@/views/customer/BookingsPage.vue";
import PhotographerPage from "@/views/photographer/PhotographerPage.vue";
import ReportPage from "@/views/customer/ReportPage.vue";
import BookingManagement from "@/views/photographer/BookingManagement.vue";
import Date from "@/views/photographer/Date.vue";
import ProfilePage from "@/views/photographer/ProfilePage.vue";


const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
    meta: { title: "Login" }, // Add title for this route
  },
  {
    path: "/roles",
    name: "Roles",
    component: RolesView,
    meta: { title: "Roles" }, // Add title for this route
  },
  {
    path: "/signup",
    name: "SignUp",
    component: SignUp,
    meta: { title: "Signup Page" },
  },
  {
    path: "/admin",
    name: "AdminPage",
    component: AdminPage,
    meta: { title: "AdminPage" },
    children: [
      {
        path: "users-management",
        name: "UsersManagement",
        component: UsersManagement,
        meta: { title: "UsersManagement" },
      },
      {
        path: "issues",
        name: "IssuesView",
        component: IssuesView,
        meta: { title: "Issues" },
      },
      {
        path: "analytics",
        name: "AnalyticsView",
        component: AnalyticsView,
        meta: { title: "Analytics" },
      }
    ],
  },
  {
    path: "/customer",
    component: CustomerPage,
    name: "CustomerPage",
    meta: { title: "Customer Page" },
    children: [
      {
        path: "search",
        name: "SearchView",
        component: SearchView,
        meta: { title: "Search" },
      },
      {
        path: "bookings",
        name: "BookingsPage",
        component: BookingsPage,
        meta: { title: "Bookings" },
      },
      {
        path: "report",
        name: "ReportPgae",
        component: ReportPage,
        meta: { title: "Report" },
      }
    ],
  },
  {
    path: "/photographer",
    component: PhotographerPage,
    name: "PhotographerPage",
    meta: { title: "Photographer Page" },
    children: [
      {
        path: "booking-management",
        name: "BookingManagement",
        component: BookingManagement,
        meta: { title: "Booking Management" },
      },
      {
        path: "date",
        name: "Date",
        component: Date,
        meta: { title: "Date" },
      },
      {
        path: "profile",
        name: "Profile",
        component: ProfilePage,
        meta: { title: "Profile" },
      },
    ],

  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
