<script>

export default{
    props:{
       VforArray:Array,
       editProject:{},
       editTask:{},

       
    },
    data(){
        return{
            selected:{
                id: "",
                name: "",
            },
            isDropdownOpen:false,
                
        }
    },
    watch:{
        'editTask':{
            immediate:true,
            handler(newValue){
                if(this.editTask != null){
                    this.selected.name = newValue.priority  
                    this.selected.id = newValue.priority_id
                    console.log(this.selected, "hello from watch",newValue )
                }else{
                    this.selected.name = null
                    this.selected.id = null
                    console.log("its run else")
                }
               
            },
            deep:true
            
        },
        'editProject':{
            immediate:true,
            handler(newValue){
                if(this.editProject != null){
                    console.log("hello from setEditName")
                    this.selected.name = newValue.manager
                    this.selected.id = newValue.manager_id
                    console.log(this.selected.id, this.selected.name, "hello from setEditname final line")
                }else{
                    this.selected.name = null
                    this.selected.id = null
                }
            },
            deep:true
        }
    },
    /*computed:{
        setEditName(){
            if(this.editname !== null){
                console.log("hello from setEditName")
                return this.selected.name = this.editname
            }
        }
    },*/
    methods:{
        toggleDrop(){
            this.$emit("toggleDrop")
            this.isDropdownOpen = !this.isDropdownOpen;
            console.log("toggleDrop is working")
        },
        select(v) {
            this.selected.id = v.id;
            this.selected.name = v.name;

            this.$emit("select", {select:this.selected})
        },
        setEditProject(){
            if(this.editProject !== null){
                console.log("hello from setEditName")
                this.selected.name = this.editProject.manager
                this.selected.id = this.editProject.manager_id
                console.log(this.selected.id, this.selected.name, "hello from setEditname final line")
            }
        },
        setEditTask(){
            if(this.editTask != null){
                console.log("hello from edit Task")
                this.selected.name = this.editTask.priority  
                this.selected.id = this.editTask.priority_id

            }
        }

    },
    mounted(){
        
        /* this.selected.id = null
        this.selected.name =""
        console.log(this.selected)
       setTimeout(()=>{
            if(this.editProject != null){
                this.setEditProject();
            }else if(this.editTask !=null){
                this.setEditTask()
            }
            
            
           
        },15)*/
        
        
    }

}




</script>

<template>

    <div class="ui fluid selection dropdown" @click="toggleDrop" :class="{ active: selected.name }">
        <i class="dropdown icon"></i>
        <input type="hidden" name="user" v-model="selected.id">
            <div class="selected-text">{{ selected.name ? selected.name : "" }} </div>
            <div class="menu" :class="{ active: isDropdownOpen }" >
                <div class="item" v-for="v in VforArray" :key="v.id" @click="select(v)">
                    {{ v.name }}
                </div>
            </div>
    </div>
</template>

<style scoped>

span{
    color:rgba(0,0,0,.87);
    font-weight: unset;
}

</style>