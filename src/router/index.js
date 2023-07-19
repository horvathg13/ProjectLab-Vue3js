import { createRouter, createWebHistory } from 'vue-router'
import Greeting from "../components/Greeting.vue"
import Register from "../components/Register.vue"
import Login from "../components/Login.vue"
import Home from "../components/Homepage.vue"
import Users from "../components/Users.vue"
import ResetPassword from "../components/ResetPassword.vue"
import RolePermission from "../components/RolePermission.vue"
import Projects from "../components/Projects.vue"
import ProjectTasks from "../components/ProjectTasks.vue"
import Notifications from "../components/Notifications.vue"
import MyTasks from "../components/MyTasks.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Greeting',
      component: Greeting
    },
    {
      path: "/register",
      name: "Register",
      component: Register
    },
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "/home",
      name:"Homepage",
      component: Home,
    },
    {
      path: "/users",
      name:"Users",
      component: Users,
      meta: 
      [{
        breadcrumb: 'Home',
        path:'/home'
      }]
    },
    {
      path: "/reset-password/:token?",
      name:"ResetPassword",
      component: ResetPassword
    },
    {
      path: "/rolepermission",
      name:"RolePermission",
      component: RolePermission
    },
    {
      path: "/projects",
      name:"Projects",
      component: Projects,
      props:true,
      meta: 
      [{
        breadcrumb: 'Home',
        path:'/home'
      }]
    },
    {
      path: "/projects/:id?/tasks",
      name:"Tasks",
      component: ProjectTasks,
      props:true,
      meta: 
      [
        {
          breadcrumb: 'Home',
          path:'/home'
        },
        {
        breadcrumb: 'Project',
        path: '/projects'
        }
        
      ]
    },
    {
      path:"/notifications",
      name:"Notifications",
      component: Notifications,
      meta:
      [
        {
          breadcrumb: "Home",
          path: "/home",
        },

      ]

    },
    {
      path:"/my-tasks",
      name:"My Tasks",
      component: MyTasks,
      meta:
      [
        {
          breadcrumb: "Home",
          path: "/home",
        },

      ]

    },
    
  
  ]
})

export default router
