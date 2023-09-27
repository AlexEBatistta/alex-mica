export function convertToCSV(data: any): string {
	const csvRows = [];

	// Obtén las claves (nombres de las personas) del objeto
	const keys = Object.keys(data);

	// Encabezados CSV (incluyendo metadatos de formato)
	const headers = ["nombre", "asistencia", "texto"];
	csvRows.push(headers.join(","));

	// Itera sobre las claves y convierte los valores en una fila CSV
	for (const key of keys) {
		const personData = data[key];
		const values = [key, personData.asistencia, personData.texto];
		csvRows.push(values.join(","));
	}

	return csvRows.join("\n");
}

/* Firebase

const database = getDatabase(firebaseApp);
const dataRef = ref(database, "invitados/alexymica");
	Define los datos que deseas guardar
const datos = {
	asistencia: "si",
	texto: "",
};
	Usa el método set() para guardar los datos en la ubicación especificada
set(dataRef, datos)
	.then(() => {
		console.log("Datos guardados correctamente.");
	})
	.catch((error) => {
		console.error("Error al guardar datos:", error);
	});

const dataRef = ref(database, "invitados/alex");
	Define los datos que deseas guardar
const datos = {
	asistencia: "si",
	texto: "",
};
	Usa el método set() para guardar los datos en la ubicación especificada
set(dataRef, datos)
	.then(() => {
		console.log("Datos guardados correctamente.");
	})
	.catch((error) => {
		console.error("Error al guardar datos:", error);
	});

const datos2 = {
	asistencia: "si",
	texto: this.inputBox.text,
};
update(dataRef, datos2)
	.then(() => {
		console.log("Datos guardados correctamente.");
	})
	.catch((error) => {
		console.error("Error al guardar datos:", error);
	});
const dataRef2 = ref(database, "invitados");
	Usa el método get() para obtener los datos
get(dataRef2)
	.then((snapshot) => {
		if (snapshot.exists()) {
				La ubicación existe y tiene datos
			const data = snapshot.val();
			console.log("Datos obtenidos:", data);
			const csvData = this.convertToCSV(data);
			console.log(csvData);
			const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
			saveAs(blob, "datos.csv");
		} else {
				La ubicación no existe o no tiene datos
			console.log("La ubicación no contiene datos.");
		}
	})
	.catch((error) => {
		console.error("Error al obtener datos:", error);
	});
*/
