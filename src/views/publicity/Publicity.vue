<template>
  <section class="background_publicity">
    <Spinner v-if="loading" />
    <div class="container-fluid">
      <div class="row justify-content-end mt-3">
        <div class="col-3">
          <div class="content-button">
            <button
              id="show-modal"
              @click="showModal = true"
              class="button-create"
            ></button>
          </div>
          <ValidationObserver v-slot="{ handleSubmit }">
            <transition name="modal">
              <div v-if="showModal" class="modal-mask">
                <div class="modal-wrapper">
                  <div class="modal-container">
                    <div class="modal-header">
                      <slot name="header"> Crear contenido </slot>
                    </div>
                    <div class="modal-body">
                      <slot name="body">
                        <ValidationProvider
                          name="Nombre"
                          rules="required|max:60|min:3"
                          v-slot="{ errors }"
                        >
                          <div class="input-group mb-3">
                            <input
                              v-model="formPublicity.name"
                              type="text"
                              class="form-control"
                              placeholder="Nombre"
                              aria-label="name"
                            />
                            <div class="input-group mb-3">
                              <span class="alert-danger">{{ errors[0] }}</span>
                            </div>
                          </div>
                        </ValidationProvider>
                        <ValidationProvider
                          name="Descripción"
                          rules="required|max:100|min:3"
                          v-slot="{ errors }"
                        >
                          <div class="input-group mb-3">
                            <input
                              v-model="formPublicity.description"
                              type="text"
                              class="form-control"
                              placeholder="Descripción"
                              aria-label="description"
                            />
                            <div class="input-group mb-3">
                              <span class="alert-danger">{{ errors[0] }}</span>
                            </div>
                          </div>
                        </ValidationProvider>
                        <ValidationProvider
                          name="Contenido ID"
                          rules="required"
                          v-slot="{ errors }"
                        >
                          <div class="input-group mb-3">
                            <input
                              v-model="formPublicity.content"
                              type="text"
                              class="form-control"
                              placeholder="Contenido (ID)"
                              aria-label="content"
                            />
                            <div class="input-group mb-3">
                              <span class="alert-danger">{{ errors[0] }}</span>
                            </div>
                          </div>
                        </ValidationProvider>
                        <p v-if="editContent">Categoría anterior</p>
                        <div v-if="editContent" class="input-group mb-3">
                          <input
                            disabled
                            v-model="categoryContext"
                            type="text"
                            class="form-control"
                            placeholder="Categoría"
                            aria-label="content"
                          />
                        </div>
                        <p v-if="editContent">Seleccionar nueva categoría</p>
                        <ValidationProvider
                          name="Tipo de categoría"
                          rules="required"
                          v-slot="{ errors }"
                        >
                          <div class="input-group mb-3">
                            <select
                              v-model="formPublicity.category"
                              class="form-select"
                            >
                              <option
                                v-for="category in dataCategories"
                                :key="category._id"
                                selected
                              >
                                {{ category._id }}
                              </option>
                            </select>
                            <div class="input-group mb-3">
                              <span class="alert-danger">{{ errors[0] }}</span>
                            </div>
                          </div>
                        </ValidationProvider>
                      </slot>
                    </div>

                    <div class="modal-footer">
                      <slot name="footer">
                        <button
                          v-if="!editContent"
                          class="modal-default-button"
                          @click.prevent="handleSubmit(create)"
                        >
                          Guardar
                        </button>
                        <button
                          v-if="editContent"
                          class="modal-default-button"
                          @click.prevent="handleSubmit(editPut)"
                        >
                          Guardar Edición
                        </button>
                        <button
                          class="modal-default-button"
                          @click="showModal = false"
                        >
                          Cerrar
                        </button>
                      </slot>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </ValidationObserver>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="container">
          <h2 class="p-4 text-center text-white">Tabla de contenido</h2>
          <table class="table table-striped table-hover tabla">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Contenido ID</th>
                <th>Rango de Edad</th>
                <th>Opc</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="content in dataContents" :key="content.id">
                <td>{{ content.name }}</td>
                <td>{{ content.description }}</td>
                <td>{{ content.content }}</td>
                <td>
                  {{
                    content.categoryId.range[0] +
                    " - " +
                    content.categoryId.range[1] +
                    " Años"
                  }}
                </td>
                <td>
                  <i
                    class="fa-solid fa-trash text-danger"
                    @click="deleteContent(content._id)"
                    title="Eliminar"
                  >
                  </i
                  >&nbsp;
                  <i
                    @click="openModalEdit(content)"
                    data-bs-toggle="modal"
                    data-bs-target="#categoryModal"
                    title="Editar Categoria"
                    class="fa-solid fa-pen-to-square text-warning"
                  ></i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Spinner from "../../components/Spinner.vue";
import Swal from "sweetalert2";
export default {
  components: {
    Spinner: Spinner,
  },
  data() {
    return {
      showModal: false,
      editContent: false,
      idContent: "",
      categoryContext: "",
      dataCategories: [],
      dataContents: [],
      formPublicity: {
        name: "",
        description: "",
        content: "",
        category: "",
      },
      loading: false,
    };
  },
  mounted() {
    this.listPublicity();
    this.listCategories();
  },
  methods: {
    listPublicity() {
      this.loading = true;
      this.axios
        .get("https://innovaclusterfaceup.herokuapp.com/publicity/publicity")
        .then((res) => {
          this.dataContents = res.data.data;
          this.formPublicity.name = "";
          this.formPublicity.description = "";
          this.formPublicity.content = "";
          this.formPublicity.category = "";
          this.loading = false;
        })
        .catch((e) => {
          console.log(e.res);
          this.loading = false;
        });
    },
    listCategories() {
      this.axios
        .get("https://innovaclusterfaceup.herokuapp.com/category/category")
        .then((res) => {
          this.dataCategories = res.data.data;
        })
        .catch((e) => {
          console.log(e.res);
        });
    },
    create() {
      this.axios
        .post(
          "https://innovaclusterfaceup.herokuapp.com/publicity/publicity",
          this.formPublicity
        )
        .then((res) => {
          this.listPublicity();
          this.formPublicity = {
            name: "",
            description: "",
            category: "",
            content: "",
          };
          this.showModal = false;
          Swal.fire({
            icon: "success",
            title: "Contenido creado exitosamente",
          });
        })
        .catch((e) => {
          console.log(e.res);
        });
    },
    deleteContent(id) {
      Swal.fire({
        title: "¿Deseas eliminar el contenido seleccionado?",
        text: "¡No podrás revertir esta acción!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Aceptar",
      }).then((result) => {
        if (result.isConfirmed) {
          this.axios
            .delete(
              `https://innovaclusterfaceup.herokuapp.com/publicity/publicity/${id}`
            )
            .then((res) => {
              this.listPublicity();
              Swal.fire({
                title: "¡Contenido Eliminado!",
                text:
                  "El contenido con ID: " +
                  id +
                  " fue eliminado de la base de datos, correctamente",
                icon: "success",
              });
            });
        }
      });
    },
    openModalEdit(data) {
      this.showModal = true;
      this.editContent = true;
      this.idContent = data._id;
      console.log(data);
      this.formPublicity = {
        _id: data._id,
        name: data.name,
        description: data.description,
        content: data.content,
        category: data.categoryId._id,
      };
      this.categoryContext =
        data.categoryId.name + " - " + data.categoryId.range;
    },
    editPut() {
      console.log(this.formPublicity);
      console.log(this.idContent);
      this.axios
        .put(
          `https://innovaclusterfaceup.herokuapp.com/publicity/publicity/${this.idContent}`,
          this.formPublicity
        )
        .then((res) => {
          this.listPublicity();
          this.showModal = false;
          this.editContent = false;
          Swal.fire({
            icon: "success",
            title: "Contenido editado correctamente",
          });
        })
        .catch((e) => {
          console.log(e.res);
        });
    },
  },
};
</script>

<style scoped>
button {
  border: none;
  cursor: pointer;
  border-radius: 15px;

  display: block;
}
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 80%;
  margin: 0 auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

button:hover {
  box-shadow: 6px 6px rgba(0, 0, 0, 0.8);
}

.background_publicity {
  /* Layout Properties */
  top: 0px;
  left: 0px;
  height: 93.9vh;
  /* UI Properties */
  background-position: center;
  background: transparent url("../../assets/imgs/Fondo.svg") 0% 0% no-repeat
    padding-box;
  border: 1px solid #707070;
  opacity: 1;
}
.tabla {
  /* Layout Properties */
  top: 248px;
  left: 88px;
  /* width: 1744px;
  height: 326px; */
  /* UI Properties */
  background: #ffffff 0% 0% no-repeat padding-box;
  border: 1px solid transparent;
  border-radius: 32px;
  opacity: 1;
}
.button-create {
  /* Layout Properties */
  top: 959px;
  left: 1793px;
  width: 79px;
  height: 79px;
  /* UI Properties */
  background: transparent url("../../assets/imgs/Create.png") 0% 0% no-repeat
    padding-box;
  opacity: 1;
  border-color: transparent;
}
.button-create:hover {
  border-color: transparent;
}
.content-button {
  width: 83px;
  /* UI Properties */
  background: #ffffff 0% 0% no-repeat padding-box;
  border: 1px solid #707070;
  opacity: 1;
  position: absolute;
  bottom: 2%;
  right: 2%;
  border-radius: 50%;
}
.content_icon_delete {
  width: 30px;
  height: 38px;
}
.content_icon_edit {
  width: 30px;
  height: 38px;
}
</style>