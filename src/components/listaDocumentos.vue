<template>
    <v-container class="mx-5">
        <v-card>

            <v-data-table :headers="headers" :items="datos" :search="search" sort-by="calories" class="elevation-1">
                <template v-slot:top>
                    <v-toolbar flat>
                        <v-toolbar-title>Documentos</v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
                            hide-details></v-text-field>
                        <v-spacer></v-spacer>
                        <v-dialog v-model="modal" max-width="500px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                                    Nuevo Documento
                                </v-btn>
                            </template>
                            <v-card>
                                <v-card-title>
                                    <span class="text-h5">{{ formTitle }}</span>
                                </v-card-title>

                                <v-card-text>
                                    <v-container>
                                        <v-row>
                                            <v-col cols="12" sm="6" md="4" v-if="editedIndex !== -1">
                                                <v-text-field disabled v-model="editedItem.doc_codigo"
                                                    label="Codigo Documento"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field v-model="editedItem.doc_nombre"
                                                    label="Nombre Documento"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field v-model="editedItem.doc_contenido"
                                                    label="Contenido documento"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-select v-model="editedItem.doc_id_proceso" :items="aProcesos"
                                                    item-text="pro_nombre" item-value="pro_id" label="Select"
                                                    persistent-hint return-object></v-select>
                                            </v-col>

                                            <v-col cols="12" sm="6" md="4">
                                                <v-select v-model="editedItem.doc_id_tipo" :items="aTipoDoc"
                                                    item-text="tip_nombre" item-value="tip_id" label="Select"
                                                    persistent-hint return-object></v-select>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-card-text>

                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" text @click="close">
                                        Cancelar
                                    </v-btn>
                                    <v-btn color="blue darken-1" text @click="save">
                                        Guardar
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                        <v-dialog v-model="modalEliminar" max-width="500px">
                            <v-card>
                                <v-card-title class="text-h5">Esta seguro de eliminar este documento ?</v-card-title>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                                    <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                                    <v-spacer></v-spacer>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-toolbar>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon small class="mr-2" @click="editarDocumento(item)">
                        mdi-pencil
                    </v-icon>
                    <v-icon small @click="eliminarDocumento(item)">
                        mdi-delete
                    </v-icon>
                </template>

            </v-data-table>
        </v-card>
        <v-alert v-if="mostrarAlerta" dense text type="success">
            {{ msgAlerta }}
        </v-alert>

    </v-container>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            search: '',
            headers: [
                {
                    text: 'Codigo Documento',
                    align: 'start',
                    sortable: false,
                    value: 'doc_codigo',
                },
                { text: 'Nombre Documento', value: 'doc_nombre' },
                { text: 'Contenido Documento', value: 'doc_contenido' },
                { text: 'Contenido Documento', value: 'doc_contenido' },
                { text: 'Actions', value: 'actions', sortable: false },

            ],
            datos: [],
            modal: false,
            modalEliminar: false,
            editedIndex: -1,
            editedItem: {
                doc_codigo: "",
                doc_contenido: "",
                doc_id: 0,
                doc_id_proceso: 0,
                doc_id_tipo: 0,
                doc_nombre: "",
            },
            deleteItem: false,

            // listado de procesos
            aProcesos: [],
            aTipoDoc: [],
            mostrarAlerta: false,
            msgAlerta: ''


        }
    },
    async mounted() {
        await this.obtenerDocumentos()
        await this.ontenerProcesos()
        await this.onObtenerTipoDocs()
    },

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'Nuevo Documento' : 'Editar Documento'
        },
    },

    watch: {
        modal(val) {
            val || this.close()
        },
        modalEliminar(val) {
            val || this.closeDelete()
        },
    },

    methods: {
        async obtenerDocumentos() {
            const oRespuesta = await axios.get('http://127.0.0.1:8000/api/documentos/listar')

            if (oRespuesta !== undefined) {
                if (oRespuesta.status == 200) {
                    this.datos = oRespuesta.data.datos
                }

            } else {
                alert("Error a consultar la info")
            }
        },
        async ontenerProcesos() {
            const oRespuesta = await axios.get('http://127.0.0.1:8000/api/procesos/listar')
            if (oRespuesta !== undefined) {
                if (oRespuesta.status == 200) {
                    this.aProcesos = oRespuesta.data.datos
                }

            } else {
                alert("Error a consultar la info")
            }
        },

        async onObtenerTipoDocs() {
            const oRespuesta = await axios.get('http://127.0.0.1:8000/api/tipo-documento/listar')
            if (oRespuesta !== undefined) {
                if (oRespuesta.status == 200) {
                    this.aTipoDoc = oRespuesta.data.datos
                }

            } else {
                alert("Error a consultar la info")
            }
        },


        editarDocumento(item) {
            this.editedIndex = this.datos.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.modal = true
        },
        
        eliminarDocumento(item) {
            this.editedItem = Object.assign({}, item)
            this.modalEliminar = true
        },
        async deleteItemConfirm() {
            const oRespuesta = await axios.delete(`http://127.0.0.1:8000/api/documentos/eliminar/${this.editedItem.doc_id}`)

            if (oRespuesta !== undefined) {
                if (oRespuesta.status == 200) {
                    this.mostrarAlerta = true
                    this.msgAlerta = oRespuesta.data.message
                    await this.obtenerDocumentos()
                    this.closeDelete()
                }
            } else {
                alert("Error a eliminar la info")
            }
            
        },

        close() {
            this.modal = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })

            // se coloca tiempo para mostrar la alerta y luego quitarlo
            setTimeout(() => {
                this.mostrarAlerta = false
            }, 2000);

        },

        closeDelete() {
            this.modalEliminar = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
            // tiempo de alerta
            setTimeout(() => {
                this.mostrarAlerta = false
            }, 2000);

        },
        async save() {
            if (this.editedIndex > -1) {
                if (typeof this.editedItem.doc_id_proceso === 'object') {
                    this.editedItem.doc_id_proceso = this.editedItem.doc_id_proceso.pro_id
                }
                if (typeof this.editedItem.doc_id_tipo === 'object') {
                    this.editedItem.doc_id_tipo = this.editedItem.doc_id_tipo.tip_id
                }
                const oDocumentoEdit = {
                    doc_nombre: this.editedItem.doc_nombre,
                    doc_contenido: this.editedItem.doc_contenido,
                    doc_id_proceso: this.editedItem.doc_id_proceso,
                    doc_id_tipo: this.editedItem.doc_id_tipo
                }

                const oRespuesta = await axios.put(`http://127.0.0.1:8000/api/documentos/editar/${this.editedItem.doc_id}`,
                    oDocumentoEdit)

                if (oRespuesta !== undefined) {
                    if (oRespuesta.status == 200) {
                        this.mostrarAlerta = true
                        this.msgAlerta = oRespuesta.data.message
                        await this.obtenerDocumentos()
                        this.close()
                    }
                } else {
                    alert("Error a actualizar la info")
                }


            } else {
                if (typeof this.editedItem.doc_id_proceso === 'object') {
                    this.editedItem.doc_id_proceso = this.editedItem.doc_id_proceso.pro_id
                }
                if (typeof this.editedItem.doc_id_tipo === 'object') {
                    this.editedItem.doc_id_tipo = this.editedItem.doc_id_tipo.tip_id
                }
                const oDocumentoEdit = {
                    doc_nombre: this.editedItem.doc_nombre,
                    doc_contenido: this.editedItem.doc_contenido,
                    doc_id_proceso: this.editedItem.doc_id_proceso,
                    doc_id_tipo: this.editedItem.doc_id_tipo
                }
                const oRespuesta = await axios.post(`http://127.0.0.1:8000/api/documentos/registrar`,
                    oDocumentoEdit)

                if (oRespuesta !== undefined) {
                    if (oRespuesta.status == 201) {
                        this.mostrarAlerta = true
                        this.msgAlerta = oRespuesta.data.message
                        await this.obtenerDocumentos()
                        this.close()
                    }
                } else {
                    alert("Error al momento de guardar la info")
                }


            }
            this.close()
        },
    }

}
</script>