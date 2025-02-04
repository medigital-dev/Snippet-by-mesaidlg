/**
 * Mengambil data dari server dengan AJAX.
 * Bisa menerima parameter sebagai objek konfigurasi atau individual parameter.
 *
 * @param {string|Object} urlOrConfig - URL request atau objek konfigurasi.
 * @param {Object} [data={}] - Data yang dikirim (opsional, abaikan jika pakai objek konfigurasi).
 * @param {string} [progressText="Loading..."] - Teks progress bar (opsional, abaikan jika pakai objek konfigurasi).
 * @param {string} [dataType="json"] - Tipe data yang dikembalikan (opsional, abaikan jika pakai objek konfigurasi).
 * @param {string} [type="POST"] - Metode request (opsional, abaikan jika pakai objek konfigurasi).
 * @returns {Promise<any>} - Promise yang mengembalikan hasil response AJAX.
 * @throws {Error} - Jika terjadi error selama request.
 */
async function fetchData(urlOrConfig, ...restParams) {
  let config;
  if (typeof urlOrConfig === "object") {
    if (restParams.length > 0) {
      throw new Error(
        "fetchData() tidak boleh memiliki parameter tambahan jika menggunakan objek konfigurasi."
      );
    }

    config = {
      url: urlOrConfig.url,
      data: urlOrConfig.data || {},
      progressText: urlOrConfig.progressText || "Loading...",
      dataType: urlOrConfig.dataType || "json",
      type: urlOrConfig.type || "POST",
    };
  } else {
    config = {
      url: urlOrConfig,
      data: restParams[0] || {},
      progressText: restParams[1] || "Loading...",
      dataType: restParams[2] || "json",
      type: restParams[3] || "POST",
    };
  }

  const id = "pb-" + randomString();
  try {
    fireNotif(
      `<div class="progress" role="progressbar">
        <div class="progress-bar progress-bar-striped progress-bar-animated" id="${id}"></div>
      </div>
      <p class="small text-center m-0">${config.progressText}</p>`,
      "",
      "bottom-center",
      0
    );

    let isFormData = config.data instanceof FormData;

    let options = {
      url: config.url,
      type: config.type,
      dataType: config.dataType,
      beforeSend: function () {
        $("#" + id).css("width", "0%");
      },
      xhr: function () {
        let xhr = new window.XMLHttpRequest();
        xhr.upload.onprogress = function (event) {
          if (event.lengthComputable) {
            let percentComplete = (event.loaded / event.total) * 100;
            $("#" + id)
              .css("width", percentComplete + "%")
              .text(Math.round(percentComplete) + "%");
          }
        };
        return xhr;
      },
    };

    if (isFormData) {
      options.processData = false;
      options.contentType = false;
      options.data = config.data;
    } else {
      options.contentType =
        config.dataType === "json"
          ? "application/json"
          : "application/x-www-form-urlencoded";

      options.data =
        config.type === "GET"
          ? $.param(config.data)
          : config.dataType === "json"
          ? JSON.stringify(config.data)
          : $.param(config.data);
    }

    return await $.ajax(options);
  } catch (error) {
    errorHandle(error);
    return null;
  } finally {
    setTimeout(() => {
      $(".toast:last").toast("hide").remove();
    }, 1500);
  }
}
