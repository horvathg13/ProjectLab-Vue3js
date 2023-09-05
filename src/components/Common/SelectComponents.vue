<script>

export default{
    props:{
       VforArray:Array,
       editProject:{},
       editTask:{},
       disable:null
       
    },
    data(){
        return{
            selected:{
                id: null,
                name: "",
            },
            isDropdownOpen:false,
            dropdownDisbale:false,
        }
    },
    watch:{
        'editTask':{
            immediate:true,
            handler(newValue){
                
                if(this.editTask != null){
                    setTimeout(()=>{
                        this.selected.id = newValue.priority_id
                        this.selected.name = newValue.priority 
                    },100)
                    
                }else{
                    this.$nextTick(()=>{
                        this.selected.name = null
                        this.selected.id = null
                    })
                    
                }
               
            },
            deep:true
            
            
        },
        'editProject':{
            immediate:true,
            handler(newValue){
                if(this.editProject != null){
                    this.$nextTick(()=>{
                        this.selected.name = newValue.manager
                        this.selected.id = newValue.manager_id
                    })
                }else{
                    this.$nextTick(()=>{
                        this.selected.name = null
                        this.selected.id = null
                    });
                }
            },
            deep:true
        },
        'disable':{
            immediate:true,
            handler(newValue){
                this.dropdownDisbale= newValue
            }
            
        }
    },
    methods:{
        toggleDrop(){
            this.$emit("toggleDrop")
            this.isDropdownOpen = !this.isDropdownOpen;
        },
        select(v) {
            this.selected.id = v.id;
            this.selected.name = v.name;
            this.$emit("select", {select:this.selected})
        },
        setEditProject(){
            if(this.editProject !== null){
                this.selected.name = this.editProject.manager
                this.selected.id = this.editProject.manager_id
            }
        },
        setEditTask(){
            if(this.editTask != null){
                this.selected.name = this.editTask.priority  
                this.selected.id = this.editTask.priority_id

            }
        }

    },
    mounted(){
        
        
        
    }

}




</script>

<template>

    <div class="ui fluid selection dropdown" @click="toggleDrop" :class="{ active: selected.name, disabled:dropdownDisbale }">
        <i class="dropdown icon"></i>
        <input type="hidden" name="user" v-model="selected.id" >
            <div class="selected-text">{{ selected.name ? selected.name:""  }} </div>
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