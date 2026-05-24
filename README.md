# API DOCUMENTATION

## Código de errores por servicios

-----------------------------------------------------------

# Room Service

## CreateRoom

| Código | Tipo              | Descripción 
|--------|-------------------|-------------
| CR001  | Success           | Creación de room exitosa
| CR002  | Validation Error  | Hace falta información en el body
| CR003  | Internal Error    | Error interno dentro de la sala

### Endpoint
```http
POST /rooms/create
```

## JoinRoom

| Código | Tipo              | Descripción 
|--------|-------------------|-------------
| JR001  | Success           | Creación de room exitosa
| JR002  | Validation Error  | Hace falta información en el body
| JR003  | Internal Error    | Error interno dentro de la sala

### Endpoint
```http
POST /rooms/join
```






| Prefijo | Módulo      |
| ------- | ----------- |
| CR      | Create Room |
| JR      | Join Room   |
| GR      | Get Room    |
| GB      | Game Board  |
| BG      | Bingo       |
| AU      | Auth        |
