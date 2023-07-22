<script>
  
  import ServiceClient from '../ServiceClient';
  import Success_Popup from './Common/Success_Popup.vue';
  import ErrorPopup from './Common/ErrorPopup.vue';
  export default {
    components: { 
       
        Success_Popup,
        ErrorPopup,
    },
    data() {
        return {
            showModal:false,
            show_popup:false,
            show_error_popup:false,
            name:"",
            slug:"",
            permission:"",
            getroles:[],
        }
    },
   
    methods:{
        updateModal(){
            
            if(this.showModal==false){
                this.showModal = true
            }
            
        },

        cancelModal(){
            this.showModal = false
            this.url = ""
        },

        createRole(data){
            const { name, slug, permission } = data;
            
            this.name = name;
            this.slug= slug;
            this.permission=permission;
           
            
            let formData = new FormData();
            formData.append("name", this.name);
            formData.append("slug", this.slug);
            let url ="/api/createrole";
                ServiceClient.post(url,formData).then((response) =>{
                    console.log(response);
                    if (response.status == 200){
                        this.show_popup = true
                        this.url = response.data.data.url
                        console.log(response.data.data.url)
                       
                    }
                }).catch((error) => {
                        
                    if (error.response && error.response.status === 400) {
                        if (error.response.data && error.response.data.message) {
                            this.show_error_popup = true
                            setTimeout(() => {
                                this.show_error_popup = false
                            },  2000)
                            
                        }
                    }
                });
            
        },

        getRoles(){
            let url ="/api/getroles";
            ServiceClient.post(url).then((response) =>{
                    
                    if (response.status == 200){
                        
                        this.getroles=response.data.roles
                        
                        
                       
                    }
                }).catch((error) => {
                        
                    if (error.response && error.response.status) {
                        if (error.response.data && error.response.data.message) {
                            this.show_error_popup = true
                            setTimeout(() => {
                                this.show_error_popup = false
                            },  2000)
                            
                        }
                    }
                });

        }
        
            
        },
        mounted(){
            this.getRoles()
        }
    }

        
</script>

<template>
 <div class="main-container">
        <div class="background login">
        </div>
        
        <div class="HP-title">
            <h1>Roles and permissions</h1>
        </div>
        <Transition name="drop">
            <Success_Popup v-if="show_popup==true"></Success_Popup>
        </Transition>
        <Transition name="drop">
            <ErrorPopup v-if="show_error_popup==true"></ErrorPopup>
        </Transition>
        <div class="centerd-component-container">
            <table class="ui striped table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Slug</th>
                        <th>Name</th>
                        <th>Permissions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="role in getroles" :key="getroles.id">
                        <td>{{role.id}}</td>
                        <td>{{role.slug}}</td>
                        <td>{{role.name}}</td>
                        <td>{{role.permissions}}</td>
                    </tr>
                </tbody>
                <tfoot class="full-width">
                    <tr>
                        <th></th>
                        <th colspan="4">
                            <div class="ui right floated small primary labeled icon button" @click="updateModal">
                                <i class="balance scale icon"></i> Add new
                               
                            </div>
                            
                            
                            
                        </th>
                    </tr>
                    
                </tfoot>
            </table>
           
        </div>
        <Transition>
                <AddRoleModal v-if="showModal==true" @cancel-modal="cancelModal"
                @create-user="createUser"></AddRoleModal>
                
        </Transition> 
    </div>
</template>