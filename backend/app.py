from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import scoped_session, sessionmaker

app = Flask(__name__)
CORS(app)

# Configuración de la base de datos RDS
DB_USER = 'postgres'
DB_PASSWORD = 'postgres'
DB_HOST = 'crud.c140ceomcm3x.us-east-2.rds.amazonaws.com'  # Endpoint de AWS
DB_NAME = 'crud'

# Configuración de SQLAlchemy para RDS
app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_POOL_SIZE'] = 10
app.config['SQLALCHEMY_POOL_TIMEOUT'] = 30
app.config['SQLALCHEMY_POOL_RECYCLE'] = 1800
app.config['SQLALCHEMY_MAX_OVERFLOW'] = 5

db = SQLAlchemy(app)

# Crear la sesión dentro del contexto de la aplicación
with app.app_context():
    SessionLocal = scoped_session(sessionmaker(bind=db.engine))

@app.teardown_appcontext
def remove_session(exception=None):
    SessionLocal.remove()

# Definición del modelo Usuario
class Usuario(db.Model):
    __tablename__ = 'usuarios'
    
    id = db.Column(db.Integer, primary_key=True)
    correo = db.Column(db.String(255), nullable=False)
    nombre = db.Column(db.String(100), nullable=False)
    edad = db.Column(db.Integer, nullable=False)

@app.route('/api/usuarios', methods=['GET'])
def obtener_usuarios():
    session = SessionLocal()
    try:
        page = request.args.get('page', 1, type=int)  # Página actual
        per_page = request.args.get('per_page', 10, type=int)  # Elementos por página

        # Calcular el offset
        offset = (page - 1) * per_page

        # Obtener los usuarios con limit y offset
        usuarios = session.query(Usuario).order_by(Usuario.id.asc()).limit(per_page).offset(offset).all()

        # Convertir a una lista de diccionarios
        usuarios_list = [
            {"id": u.id, "correo": u.correo, "nombre": u.nombre, "edad": u.edad} for u in usuarios
        ]
        
        # Mostrar los datos en la terminal para verificar
        print(usuarios_list)

        # Devolver solo la lista de usuarios
        return jsonify(usuarios_list)
    finally:
        session.close()


# Ruta para obtener un usuario en específico por ID
@app.route('/api/usuarios/<int:id>', methods=['GET'])
def obtener_usuario_por_id(id):
    session = SessionLocal()
    try:
        usuario = session.query(Usuario).get(id)
        if usuario:
            return jsonify({"id": usuario.id, "correo": usuario.correo, "nombre": usuario.nombre, "edad": usuario.edad})
        else:
            return jsonify({"mensaje": "Usuario no encontrado"}), 404
    finally:
        session.close()

# Ruta para crear un nuevo usuario
@app.route('/api/usuarios', methods=['POST'])
def crear_usuario():
    session = SessionLocal()
    try:
        data = request.get_json()
        correo = data.get('correo')
        nombre = data.get('nombre')
        edad = data.get('edad')

        if not correo or not nombre or not edad:
            return jsonify({"mensaje": "Faltan datos"}), 400

        nuevo_usuario = Usuario(correo=correo, nombre=nombre, edad=edad)
        session.add(nuevo_usuario)
        session.commit()
        return jsonify({
            "id": nuevo_usuario.id,
            "correo": nuevo_usuario.correo,
            "nombre": nuevo_usuario.nombre,
            "edad": nuevo_usuario.edad
        }), 201
    except Exception as e:
        session.rollback()
        return jsonify({"mensaje": f"Error al crear usuario: {str(e)}"}), 500
    finally:
        session.close()

# Actualizar un usuario existente
@app.route('/api/usuarios/<int:id>', methods=['PUT'])
def actualizar_usuario(id):
    session = SessionLocal()
    try:
        usuario = session.query(Usuario).get(id)
        if not usuario:
            return jsonify({"mensaje": "Usuario no encontrado"}), 404

        data = request.get_json()
        if 'correo' in data:
            usuario.correo = data['correo']
        if 'nombre' in data:
            usuario.nombre = data['nombre']
        if 'edad' in data:
            usuario.edad = data['edad']

        session.commit()
        return jsonify({"mensaje": "Usuario actualizado con éxito"}), 200
    except Exception as e:
        session.rollback()
        return jsonify({"mensaje": f"Error al actualizar usuario: {str(e)}"}), 500
    finally:
        session.close()

# Ruta para eliminar un usuario
@app.route('/api/usuarios/<int:id>', methods=['DELETE'])
def eliminar_usuario(id):
    session = SessionLocal()
    try:
        usuario = session.query(Usuario).get(id)
        if not usuario:
            return jsonify({"mensaje": "Usuario no encontrado"}), 404

        session.delete(usuario)
        session.commit()
        return jsonify({"mensaje": "Usuario eliminado exitosamente"}), 200
    except Exception as e:
        session.rollback()
        return jsonify({"mensaje": f"Error al eliminar usuario: {str(e)}"}), 500
    finally:
        session.close()

# Ruta para obtener el total de usuarios
@app.route('/api/usuarios/total', methods=['GET'])
def obtener_total_usuarios():
    total = Usuario.query.count()
    return jsonify({"total_usuarios": total}), 200


# Ruta para obtener usuarios filtrados
@app.route('/api/usuarios', methods=['GET'])
def obtener_usuarios_filtrados():
    filtro = request.args.get('filtro', 'nombre')
    busqueda = request.args.get('busqueda', '').lower()

    if filtro not in ['nombre', 'correo', 'edad']:
        return jsonify({"error": "Filtro no válido"}), 400

    if filtro == 'nombre':
        usuarios = Usuario.query.filter(Usuario.nombre.ilike(f"%{busqueda}%")).all()
    elif filtro == 'correo':
        usuarios = Usuario.query.filter(Usuario.correo.ilike(f"%{busqueda}%")).all()
    elif filtro == 'edad':
        usuarios = Usuario.query.filter(Usuario.edad.ilike(f"%{busqueda}%")).all()

    usuarios_data = [{"id": u.id, "nombre": u.nombre, "correo": u.correo, "edad": u.edad} for u in usuarios]
    return jsonify(usuarios_data), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)