	
	
	//classe despesas
    class Despesa{
     
        constructor(ano, mes, dia, tipo, valor, descricao){
           this.ano = ano
           this.mes = mes
           this.dia = dia
           this.tipo = tipo
           this.descricao = descricao
           this.valor = valor
        }
    
        validarDados(){
            for (let i in this) {
                if (this[i] == undefined || this[i] == '' || this[i] == null) {
                   return false;                
                }
            }
            return true;
        }
    }
    
    //classe Bd
    class Bd{
    
        constructor(){
            let id = localStorage.getItem('id') //recuperando o indice existente no local storage
            if(id === null){ // veirifica se nao tem indice
                localStorage.setItem('id', 0) //setando o indice 0 no local storage
            }
        }
    
        getProximoId(){ //essa funcao retorna o proximo id ou indice
            let proximoId = localStorage.getItem('id') // verificando qual id existente 
            return parseInt(proximoId)+1 // retornando qual será o proximo id
        }
    
        gravar (d){        
           let id =  this.getProximoId() //descobrindo qual será o proximo id e colocando na variável
            localStorage.setItem(id, JSON.stringify(d)) // setando no local storage o novo id com a String(objeto)
            localStorage.setItem('id', id)
        } 
        
        listar(){
            let id = localStorage.getItem('id')
            let despesas = Array()
            for(let i =1; i<= id; i++){
                let despesa  = JSON.parse(localStorage.getItem(i))
                if(despesa != null){
                    despesa.id=i
                    despesas.push(despesa)
                }
            }
            return despesas            
        }

        pesquisarFiltro(filtroDespesa){
            let todasDespesasFiltradas = Array()
            todasDespesasFiltradas = this.listar()          

            if(filtroDespesa.ano != ''){
                todasDespesasFiltradas = todasDespesasFiltradas.filter(d => d.ano == filtroDespesa.ano)
            }
            if(filtroDespesa.mes != ''){
                todasDespesasFiltradas = todasDespesasFiltradas.filter(d => d.mes == filtroDespesa.mes)
            }
            if(filtroDespesa.dia != ''){
                todasDespesasFiltradas = todasDespesasFiltradas.filter(d => d.dia == filtroDespesa.dia)
            }
            if(filtroDespesa.tipo != ''){
                todasDespesasFiltradas = todasDespesasFiltradas.filter(d => d.tipo == filtroDespesa.tipo)
            }
            if(filtroDespesa.descricao != ''){
                todasDespesasFiltradas = todasDespesasFiltradas.filter(d => d.descricao == filtroDespesa.descricao)
            }
            if(filtroDespesa.valor != ''){
                todasDespesasFiltradas = todasDespesasFiltradas.filter(d => d.valor == filtroDespesa.valor)
            }            
            return todasDespesasFiltradas
        }

        remover(id){
            localStorage.removeItem(id)
        }
    }
    //instanciando um novo BD
    let bd = new Bd(); 

    //Controller // bean no java 


    function recuperandoDadosTela(){
        let dia = document.getElementById('dia');
        let mes = document.getElementById('mes');
        let ano = document.getElementById('ano');
        let tipo = document.getElementById('tipo');
        let descricao = document.getElementById('descricao');
        let valor = document.getElementById('valor');

    }

    function cadastrarDespesa(){
        
        recuperandoDadosTela()
        let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, valor.value, descricao.value);
        if(despesa.validarDados()){
          bd.gravar(despesa)
          document.getElementById('modal_titulo').innerHTML  = 'Registro inserido com sucesso!'
          document.getElementById('modal_titulo_div').className = 'modal-header text-success'  
          document.getElementById('msgPadrao').innerHTML = 'Despesa foi cadastrada com sucesso!' 
          document.getElementById('msgButton').className = 'btn btn-success'    
          $('#modalRegistraDespesas').modal('show')

          dia.value = ''
          mes.value = ''
          ano.value = ''
          tipo.value = ''
          descricao.value = ''
          valor.value = ''     

       }else{    
        document.getElementById('modal_titulo').innerHTML  = 'Erro na inclusão do Registro!'
        document.getElementById('modal_titulo_div').className = 'modal-header text-danged'
        document.getElementById('msgPadrao').innerHTML = 'Erro na gravação! verifique se há campos vazios!'
        document.getElementById('msgButton').className = 'btn btn-danger' 
          $('#modalRegistraDespesas').modal('show')
       }      
    }

    function carregarTodasDespesas(){
        let despesas = Array()
        despesas = bd.listar()
        let listaDespesas = document.getElementById('listaDespesas')

        despesas.forEach(function(d){
            let linha =   listaDespesas.insertRow()
            switch(d.tipo){
                case '1' : d.tipo = 'Alimentação'
                case '2' : d.tipo = 'Educação'
                case '3' : d.tipo = 'Lazer'
                case '4' : d.tipo = 'Saúde'
                break
            }  
            linha.insertCell(0).innerHTML= `${d.dia}/${d.mes}/${d.ano}`
            linha.insertCell(1).innerHTML = d.tipo         
            linha.insertCell(2).innerHTML = d.descricao
            linha.insertCell(3).innerHTML = d.valor
            //crando um botao para exclusao
            let btn = document.createElement("button") //criando um elemento html
            btn.className = 'btn btn-danger' //dando uma classe ao novo elemento 
            btn.innerHTML = '<i class = "fas fa-times"></i>' // criando uma tag i
            btn.id = `id_despesa_${d.id}` //colocando o id em cada botao
            btn.onclick= function(){
                
                let id = this.id.replace('id_despesa_', '')
             
                bd.remover(id)
                window.location.reload()
            }
            linha.insertCell(4).append(btn) // inserindo uma celula
            console.log(d);
        })

    }

    function pesquisarDespesa(){
        recuperandoDadosTela()
        let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, valor.value, descricao.value)
        let despesas =  bd.pesquisarFiltro(despesa)
        let listaDespesas = document.getElementById('listaDespesas')
        listaDespesas.innerHTML = ''
        despesas.forEach(function(d){
            let linha =   listaDespesas.insertRow()
            switch(d.tipo){
                case '1' : d.tipo = 'Alimentação'
                case '2' : d.tipo = 'Educação'
                case '3' : d.tipo = 'Lazer'
                case '4' : d.tipo = 'Saúde'
                break
            }  
            linha.insertCell(0).innerHTML= `${d.dia}/${d.mes}/${d.ano}`
            linha.insertCell(1).innerHTML = d.tipo         
            linha.insertCell(2).innerHTML = d.descricao
            linha.insertCell(3).innerHTML = d.valor

        })
    }


   