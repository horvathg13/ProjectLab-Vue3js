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
import Denied from "../components/AccessDenied.vue"
import FavoriteProjects from "../components/FavoriteProjects.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Greeting',
      component: Greeting,
      meta:{requiresAuth: true}

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
      meta:{requiresAuth: true}
    },
    {
      path: "/users",
      name:"Users",
      component: Users,
      meta: {breadcrumbs:[
        {
        breadcrumb: 'Home',
        path:'/home'
        }
      ],
      requiresAuth: true
      }
      
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
      meta:{breadcrumbs:[
        {
        breadcrumb: 'Home',
        path:'/home'
        }
      ],
      requiresAuth: true}
      
    },
    {
      path: "/projects/:id?/tasks",
      name:"Tasks",
      component: ProjectTasks,
      props:true,
      meta:{breadcrumbs:[
        {
          breadcrumb: 'Home',
          path:'/home'
        },
        {
        breadcrumb: 'Project',
        path: '/projects'
        }
      ],
      requiresAuth: true}
      
    },
    {
      path:"/notifications",
      name:"Notifications",
      component: Notifications,
      meta:{breadcrumbs:[
        {
          breadcrumb: "Home",
          path: "/home",
        },
      ],
      requiresAuth: true}
      

    },
    {
      path:"/my-tasks",
      name:"My Tasks",
      component: MyTasks,
      meta: {breadcrumbs:[
        {
          breadcrumb: "Home",
          path: "/home",
        },
      
      ],
      requiresAuth: true}
      

    },
    {
      path:"/accessdenied",
      name:"Denied",
      component:Denied,
      meta: {breadcrumbs:[
        {
          breadcrumb: "Home",
          path: "/home",
        },
      
      ],
      requiresAuth: true}
      

    },
    {
      path:"/favorite-projects",
      name:"Favorite Projects",
      component: FavoriteProjects,
      meta: {breadcrumbs:[
        {
          breadcrumb: "Home",
          path: "/home",
        },
      
      ],
      requiresAuth: true}
      

    },
    
    
  
  ]
})

router.beforeEach((to, from) => {
  if ( to.meta.requiresAuth && !localStorage.getItem("token")) {
    return {path: "/login"}
  } 
});

export default router
