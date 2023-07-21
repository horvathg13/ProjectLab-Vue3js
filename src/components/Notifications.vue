<script>
  import {store} from "../VuexStore";
  import Error from './Common/ErrorPopup.vue';
export default{
    props:{

    },
    components:{
        Error,
    },
    data(){
        return{
            notifications:{},
            message:"",
            showErrorPopup:false,
        }
    },
    watch: {
        '$store.state.notifications'(newValue) {
            this.notifications = newValue
            
            console.log(newValue.length, "hello notifica watch");
        },
        notifications(newValue){
            if(newValue.length == 0){
                console.log("enter the hook")
                this.message = "You have no system notification!"
                this.showErrorPopup = true
                setTimeout(() => {
                    this.showErrorPopup = false
                    this.message = "";
                },2000)
            }
            
       
            
        }
    },
    computed:{

        
    },
    mounted(){
       
    },
}
</script>

<template>
    <div class="main-container">
        <div class="background component">
        </div>
        <Transition name="drop">
            <Error v-if="showErrorPopup == true" :message="this.message"></Error>
        </Transition>
        <div class="content-container"> 

            <div class="centerd-component-container">
                
                <div class="scrolling-table-container">
                    <table class="ui selectable striped table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Type</th>
                                <th>Title</th>
                                <th>Status</th>
                                <th>Deadline</th>
                                <!--<th>Days left</th>-->
                            </tr>
                        </thead>
                        
                        <tbody>
                            <tr v-for="n in notifications" :key="n.id" class="warning">
                                <td>{{n.id}}</td>
                                <td>{{n.type}}</td>
                                <td>{{n.title}}</td>
                                <td>{{n.status}}</td>
                                <td>{{n.deadline}}</td>
                                <!--<td>{{ n.days }} </td>-->     
                            </tr>
                        </tbody>
                        <tfoot class="full-width">
                            <tr>
                                <th></th>
                                <th></th>
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
                
        </Transition>
        
    </div>

</template>

<style scoped>
 .ui.segment{
        position: absolute;
        width:100%;
        height: 100px !important;
       
    }
</style>
