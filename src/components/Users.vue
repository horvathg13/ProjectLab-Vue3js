<script>
  import ServiceClient from '../ServiceClient';
import ErrorPopup from './Common/ErrorPopup.vue';
import AddUserModal from './Modals/AddUserModal.vue';
import AreYouSureModal from './Modals/AreYouSureModal.vue';
import RoleSelectorModal from './Modals/RoleSelectorModal.vue';
import Success_Popup from './Common/Success_Popup.vue';
import ResetPasswordManualModal from './Modals/ResetPasswordManualModal.vue';
import ContentTitle from './Common/ContentTitle.vue';
import CircularMenu from './Common/CircularMenu.vue';
import {store} from '../VuexStore'
import EventHandler from "@/components/Common/EventHandler/eventHandler.vue";


  export default {
    components: {
      EventHandler,
        AddUserModal,
        Success_Popup,
        ErrorPopup,
        ResetPasswordManualModal,
        RoleSelectorModal,
        AreYouSureModal,
        ContentTitle,
        CircularMenu
    },
    data() {
        return {
            /*Event Handler*/
            message:"",
            serverError:'',
            errorArray:[],
            buttons: [
              {
                label: "Ban User",
                emit: { "event": "DataSave", "data": null, "str": "BanUser" },
                class: "ui small red button item",
                icon: "ui close icon",
                onclick: "DataSaveEmit",
              },
              {
                label: "Roles",
                emit: { "event": "DataSaveRolesEmit", "data": null, "str": "open_show_role_selector_modal" },
                class: "ui small purple button item",
                icon: "ui balance scale icon",
                onclick: "DataSaveRolesEmit"
              },
              {
                label: "Reset<br> password",
                emit: { "event": "DataSaveResetPassword", "data": null, "str": "PasswordResetManual" },
                class: "ui small orange button item",
                icon: "ui key icon",
                onclick: "DataSaveResetPasswordEmit"
              }
            ],

            /*Popup Control*/
            showModal:false,
            show_popup:false,
            show_error_popup:false,
            show_reset_password_manual_modal:false,
            show_role_selector_modal:false,
            triggerModal:false,
            triggerValue: null,

            /*Form fields*/
            name:"",
            email:"",
            url:"",
            role_id:"",
            role_name:"",

            /*Dropdown*/
            isDropdownOpen: false,

            /*Button Control*/
            adminbuttons:{},
            tryAgain:null,

            /*Others*/
            user:{},
            getusers:Array,
            getroles:Array,
            dataSave:[],
            func:'',
            userRole:{},
        }
    },

    watch:{
        '$store.state.userRole'(newValue) {
            this.userRole = newValue;
        },
    },
    
    methods:{
        trigger(data){
            const{trigger} = data
            this.triggerValue = trigger
            if(this.triggerValue === true){
                if(this.func === 'BannUser'){
                    this.BanUser();
                }else if(this.func === 'open_show_role_selector_modal'){
                    this.open_show_role_selector_modal();
                }else if(this.func === 'PasswordResetManual'){
                    this.PasswordResetManual()
                }
            }else if(this.triggerValue===false){
                this.triggerModal=false;
                this.triggerValue=null;
            }
        },
        toggleDropdown() {
            this.isDropdownOpen = !this.isDropdownOpen;
        },
        open_show_role_selector_modal(){
            this.triggerModal = false
            this.triggerValue = null
            this.user.id = this.dataSave.id
            this.user.name = this.dataSave.name
            this.user.roles= this.dataSave.roles?this.dataSave.roles.trim().split(","):[]
            this.show_role_selector_modal = true
        },
        updateModal(){
            if(this.showModal==false){
                this.showModal = true
            }
        },

        cancelModal(){
            this.showModal = false
            this.show_reset_password_manual_modal=false
            this.show_role_selector_modal = false
            this.url = "",
            this.tryAgain=null
        },

        createUser(data){
            this.closeErrorModal();
            const { name, email } = data;
            
            this.name = name;
            this.email= email;
            this.tryAgain=true;

            ServiceClient.createUser(this.name,this.email).then((response) =>{
              if (response.status === 200){
                this.message = response.data.message;
                this.show_popup = true
                this.url = response.data.data.url
                setTimeout(() => {
                  this.getUsers();
                  this.show_popup = false
                  this.message = "";
                },  2000)

              }
            }).catch((error) => {
              this.tryAgain=false
              this.serverError=error
              this.show_error_popup=true
            });
        },
        copy(){
            if(this.url.length>0){
                navigator.clipboard.writeText(this.url)
                .then(() => {
                    this.message="URL copied to clipboard"
                    this.show_popup = true
                    setTimeout(() => {
                        this.show_popup = false
                        this.message="";
                    },  2000)
                
                })
                .catch((error) => {
                    this.message="Failed to copy URL to clipboard!"
                    console.error("Failed to copy URL to clipboard:", error);
                    this.show_error_popup = true
                    setTimeout(() => {
                            this.show_error_popup = false
                            this.message = "";
                    },  2000)
                });
            }else{
                this.show_error_popup = true
                setTimeout(() => {
                        this.show_error_popup = false
                },  2000)
            }
        },

          getUsers(){
              ServiceClient.getUsers().then(users=>{
                this.getusers = users
              }).catch((error) => {
                this.serverError=error;
                this.show_error_popup = true
              });
          },

          getRoles(){
            ServiceClient.getRoles().then(roles=>{
              this.getroles = roles
            }).catch((error) => {
              this.serverError=error;
              this.show_error_popup = true
            });
          },

          BanUser() {
              this.triggerModal = false;
              this.triggerValue = null;
              ServiceClient.banUser(this.dataSave.id).then((result)=>{
                  this.show_popup = true;
                  setTimeout(() => {
                    this.show_popup = false;
                  }, 1500);
                  this.getusers=result
              }).catch((error) => {
                console.log(error)
                if(error.response){
                  this.serverError=error;
                  this.show_error_popup = true;
                }
              });
          },
          PasswordResetManual(){
              this.triggerModal = false;
              this.triggerValue = null;
              ServiceClient.passwordResetManual(this.dataSave.id).then((response) => {
                if (response.status === 200) {
                  this.url = response.data.data.url
                  this.show_popup = true
                  this.show_reset_password_manual_modal = true;
                  setTimeout(() => {
                    this.show_popup = false
                  }, 1500)
                }
              }).catch((error) => {
                this.serverError=error;
                this.show_error_popup = true;
              });
          },

          userToRole(data) {
              this.closeErrorModal()
              this.user={};
              const { selectedRole, user_id, remove } = data
              this.tryAgain=true;

              ServiceClient.userToRole(user_id,selectedRole,remove).then(() => {
                  this.show_popup = true
                  setTimeout(() => {
                    this.show_popup = false
                    this.show_role_selector_modal = false
                  }, 1500)
                  this.getUsers();
              }).catch((error) => {
                if(error.response){
                  this.serverError=error;
                  this.show_error_popup = true;
                  this.tryAgain=false
                  this.open_show_role_selector_modal()
                }
              });
          },

          DataSave(user){
              const {data, str} = user
              this.dataSave = user.data;
              this.func = user.str
              this.triggerModal= true
          },
          closeErrorModal(){
            this.show_error_popup=false
            this.serverError='';
            this.errorArray=[]
          }
        },
        beforeRouteEnter(to, from, next) {
          const isAdmin = store.state.userRole.some(item => item.role === "Admin");
          if(isAdmin === true){
            next();
          }else{
            next('/accessdenied');
          }
        },
        mounted(){
            this.getUsers()
            this.getRoles()
        }
    }

        
</script>

<template>
    <div class="main-container">
        <div class="background component">
        </div>
        <EventHandler
            :successPopup="show_popup"
            :error-popup="show_error_popup"
            :errorarray="errorArray"
            :serverError="serverError"
            @close="closeErrorModal"
        />
        <div class="content-container">
        
            <div class="centerd-component-container">
                <div class="scrolling-table-container">
                    <table class="ui selectable striped table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>E-mail</th>
                                <th>Role</th>
                                <th>
                                <button class="ui small primary labeled icon button" @click="updateModal"><i class="user plus icon"></i>Add</button>
                                </th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="user in getusers" :key="user.id">
                                <td>{{user.id}}</td>
                                <td :style="{overflow:'hidden', textOverflow:'ellipsis'}">{{user.name}}</td>
                                <td :style="{overflow:'hidden', textOverflow:'ellipsis'}">{{user.email}}</td>
                                <td>{{user.roles}}</td>
                                <td>
                                    <CircularMenu
                                    :buttons="this.buttons"
                                    :data="user"
                                    :component="this.$route.name"
                                    @DataSaveEmit="DataSave"
                                    @DataSaveRolesEmit="DataSave"
                                    @DataSaveResetPassword="DataSave"></CircularMenu>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot class="full-width">
                            <tr>
                                <th></th>
                                <th colspan="4">
                                </th>
                            </tr>
                            
                        </tfoot>
                    </table>
            </div>
            </div>
        </div>
        <Transition>
                <AddUserModal v-if="showModal==true"
                @cancel-modal="cancelModal"
                @create-user="createUser" 
                @copy-to="copy" 
                :Url="this.url"
                :tryAgain="this.tryAgain"></AddUserModal>
        </Transition> 
        <Transition>
            <ResetPasswordManualModal v-if="show_reset_password_manual_modal==true" @cancel-modal="cancelModal" @copy-to="copy" :Url="this.url"></ResetPasswordManualModal>
        </Transition>
        <Transition>
            <RoleSelectorModal v-if="show_role_selector_modal===true" @toggleDrop= "toggleDropdown" @cancel-modal="cancelModal" @attachRole="userToRole" :getusers="this.getusers" :getroles="this.getroles" :isDropdownOpen="this.isDropdownOpen" :user="this.user" :tryAgain="this.tryAgain"></RoleSelectorModal>
        </Transition>
        <Transition>
            <AreYouSureModal v-if="triggerModal==true" @trigger="trigger"></AreYouSureModal>
        </Transition>
    </div>
</template>

<style scoped>
.ui.table.uniq td{
    overflow: auto;
    text-overflow: ellipsis;
}
</style>
