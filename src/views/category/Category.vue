<template>
  <section class="background_category">
    <Spinner v-if="loading" />
    <div class="container">
      <div class="mt-3">
        <h1 class="text-center text-white" v-if="data.length === 0">
          No hay registros
        </h1>
        <!-- BEGIN MODAL CREATE AND EDIT CATEGORY -->
        <div class="content-button">
          <button
            type="button"
            class="button-create"
            data-bs-toggle="modal"
            data-bs-target="#categoryModal"
            title="Agregar Nueva Categoria"
            :v-show="(showModal = true)"
            data-keyboard="false"
            @click="openModalCreate"
          ></button>
        </div>

        <div
          class="modal fade"
          id="categoryModal"
          tabindex="-1"
          aria-labelledby="ModalCategory"
          aria-hidden="true"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          v-if="showModal"
        >
          <div
            class="modal-dialog modal-dialog-centered modal-dialog-scrollable"
          >
            <div class="modal-content">
              <div class="modal-header bg-primary text-white">
                <h5 class="modal-title" id="ModalCategory">
                  {{ title }}
                </h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  id="close"
                  @click="cerrarModal"
                ></button>
              </div>
              <ValidationObserver v-slot="{ handleSubmit }">
                <form>
                  <div class="modal-body">
                    <ValidationProvider
                      name="Nombre"
                      rules="required|max:60|min:3|alpha_spaces"
                      v-slot="{ errors }"
                    >
                      <div class="mb-3">
                        <label for="name" class="col-form-label"
                          >Nombre: <span class="text-danger">*</span></label
                        >
                        <input
                          type="text"
                          class="form-control"
                          id="name"
                          v-model="formCategory.name"
                        />
                        <span class="alert-danger">{{ errors[0] }}</span>
                      </div>
                    </ValidationProvider>
                    <div class="row">
                      <div class="col-6">
                        <ValidationProvider
                          name="Edad mínima"
                          rules="required|between:1,100|integer"
                          v-slot="{ errors }"
                        >
                          <label for="min" class="col-form-label"
                            >Edad mínima:
                            <span class="text-danger">*</span></label
                          >
                          <input
                            type="number"
                            class="form-control"
                            id="min"
                            min="0"
                            :max="max"
                            v-model="min"
                            placeholder="Edad mínima"
                          />

                          <span class="alert-danger">{{ errors[0] }}</span>
                        </ValidationProvider>
                      </div>
                      <div class="col-6">
                        <ValidationProvider
                          name="Edad máxima"
                          rules="required|between:1,100|integer"
                          v-slot="{ errors }"
                        >
                          <label for="max" class="col-form-label"
                            >Edad máxima:
                            <span class="text-danger">*</span></label
                          >
                          <input
                            type="number"
                            class="form-control"
                            id="max"
                            :min="min"
                            max="100"
                            v-model="max"
                            placeholder="Edad máxima"
                          />
                          <span class="alert-danger">{{ errors[0] }}</span>
                        </ValidationProvider>
                      </div>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button
                      type="button"
                      class="btn btn-secondary"
                      data-bs-dismiss="modal"
                      @click="cerrarModal"
                    >
                      Cancelar
                    </button>
                    <input
                      type="submit"
                      class="btn btn-primary"
                      @click.prevent="handleSubmit(createCategory)"
                      v-if="!editContent"
                      :disabled="form_submitting"
                      :value="form_submitting ? 'Cargando...' : 'Guardar '"
                    />
                    <button
                      :disabled="actualizarDeshabilitado"
                      type="button"
                      class="btn btn-primary"
                      @click.prevent="handleSubmit(editCategory)"
                      v-if="editContent"
                    >
                      Actualizar
                    </button>
                  </div>
                </form>
              </ValidationObserver>
            </div>
          </div>
        </div>
        <!-- END MODAL CREATE AND EDIT CATEGORY -->
        <!-- TABLE LIST CATEGORIES -->
        <h2 v-if="data.length >= 1" class="p-3 text-white text-center">
          Listado de categorías
        </h2>
        <table
          class="table table-striped table-hover tabla mt-3"
          v-if="data.length >= 1"
        >
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nombre</th>
              <th scope="col">Rango</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in data" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.name }}</td>
              <th>{{ item.range[0] + " - " + item.range[1] + " Años" }}</th>
              <td>
                <div class="row">
                  <div class="col-2 content_icon_delete">
                    <img
                      src="../../assets/imgs/Delete.png"
                      alt="Delete"
                      @click="deleteCategory(item)"
                      title="Eliminar"
                      width="18"
                    />
                  </div>
                  <div class="col-2 content_icon_delete_edit">
                    <img
                      src="../../assets/imgs/Edit.png"
                      alt="Edit"
                      width="20"
                      title="Editar Categoria"
                      @click="openModalEdit(item)"
                      data-bs-toggle="modal"
                      data-bs-target="#categoryModal"
                    />
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
<script>
import Swal from "sweetalert2";
import Spinner from "../../components/Spinner.vue";

export default {
  components: {
    Spinner: Spinner,
  },
  data() {
    return {
      actualizarDeshabilitado: true,
      showModal: false,
      editContent: false,
      data: [],
      formCategory: {
        name: null,
      },
      min: null,
      max: null,
      title: "",
      btnCreate: false,
      btnEdit: false,
      idCategory: "",
      loading: false,
      form_submitting: false,
    };
  },
  mounted() {
    this.listCategory();
  },
  watch: {
    max(nuevoValor) {
      if (nuevoValor && nuevoValor <= 100) {
        this.actualizarDeshabilitado = false;
      } else {
        this.actualizarDeshabilitado = true;
      }
    },
    min(nuevoValor) {
      if (nuevoValor && nuevoValor > 0 && nuevoValor <= 100) {
        this.actualizarDeshabilitado = false;
      } else {
        this.actualizarDeshabilitado = true;
      }
    },
    "formCategory.name": function (nuevoValor) {
      if (nuevoValor) {
        this.actualizarDeshabilitado = false;
      } else {
        this.actualizarDeshabilitado = true;
      }
    },
  },
  methods: {
    cerrarModal() {
      this.actualizarDeshabilitado = true;
      (this.formCategory = {
        name: null,
      }),
        (this.min = null);
      this.max = null;
    },
    listCategory() {
      this.loading = true;
      this.axios
        .get("https://innovaclusterfaceup.herokuapp.com/category/category")
        .then((res) => {
          this.data = res.data.data;
          this.loading = false;
        })
        .catch((e) => {
          console.log(e.res);
          this.loading = false;
        });
    },
    createCategory() {
      this.formCategory.range = [parseInt(this.min), parseInt(this.max)];
      this.form_submitting = true;
      this.axios
        .post(
          "https://innovaclusterfaceup.herokuapp.com/category/category",
          this.formCategory
        )
        .then((res) => {
          this.listCategory();
          this.form_submitting = false;
          this.formCategory.name = "";
          this.min = 0;
          this.max = 0;
          this.showModal = false;
          document.getElementById("close").click();
          Swal.fire({
            icon: "success",
            title: "Categoría registrada exitosamente",
          });
        })
        .catch((e) => {
          console.log(e.res);
          this.form_submitting = false;
        });
    },
    deleteCategory(data) {
      this.formCategory = {
        name: data.name,
      };
      this.idCategory = data._id;
      Swal.fire({
        title: "¿Deseas Eliminar la Categoría Seleccionada?",
        text: "No podrás revertir esta acción!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Aceptar",
      }).then((result) => {
        if (result.isConfirmed) {
          this.axios
            .delete(
              `https://innovaclusterfaceup.herokuapp.com/category/category/${this.idCategory}`
            )
            .then((res) => {
              this.listCategory();
              Swal.fire({
                title: "¡Categoría Eliminada!",
                html: `La categoría <b>${this.formCategory.name}</b> fue eliminada de la base de datos, correctamente`,
                icon: "success",
              });
              this.formCategory.name = "";
              this.min = 0;
              this.max = 0;
            })
            .catch((e) => {
              console.log(e.res);
            });
        }
      });
    },
    openModalCreate() {
      this.formCategory = {
        name: "",
        range: [],
      };
      this.min = 0;
      this.max = 0;
      this.title = "Nueva categoría";
      this.editContent = false;
      this.btnCreate = true;
      this.btnEdit = false;
    },
    openModalEdit(data) {
      this.showModal = true;
      this.editContent = true;
      this.formCategory = {
        name: data.name,
      };
      this.min = data.range[0];
      this.max = data.range[1];
      this.title = "Editar categoría";
      this.btnCreate = false;
      this.btnEdit = true;
      this.idCategory = data._id;
    },
    editCategory() {
      this.form_submitting = true;
      this.formCategory.range = [parseInt(this.min), parseInt(this.max)];
      this.axios
        .put(
          "https://innovaclusterfaceup.herokuapp.com/category/category/" +
            this.idCategory,
          this.formCategory
        )
        .then((res) => {
          this.listCategory();
          this.form_submitting = false;
          this.showModal = false;
          this.editContent = false;
          document.getElementById("close").click();
          Swal.fire({
            icon: "success",
            title: "Categoría editada correctamente",
          });
        })
        .catch((e) => {
          console.log(e.res);
          this.form_submitting = false;
        });
    },
  },
};
</script>
<style scoped>
.background_category {
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
  width: 83px;
  height: 84px;
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
