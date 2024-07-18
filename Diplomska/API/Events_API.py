from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS, cross_origin
import base64
from datetime import datetime



app = Flask(__name__)
cors = CORS(app) #potrebno, da lahko browser requesta API
app.config['CORS_HEADERS'] = 'Content-Type'

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'admin'
app.config['MYSQL_DB'] = 'Events'

mysql = MySQL(app)


@app.route('/', methods=['GET']) #za test, je useless
@cross_origin()
def get_data():
    try:
        cur = mysql.connection.cursor()
        cur.execute('''SELECT * FROM Users''')
        data = cur.fetchall()
        cur.close()
        return jsonify(data), 200
    except Exception as e:
        error_response = {
            'success': False,
            'message': str(e)
        }
        return jsonify(error_response), 500


@app.route('/events', methods=['GET']) #izpis vseh eventov
@cross_origin()
def get_events():
    try:
        cur = mysql.connection.cursor()
        cur.execute('''SELECT event.id_event, event.title, event.description, DATE_FORMAT(event.datetime_start, '%H:%i %d-%m-%Y') AS formatted_date, DATE_FORMAT(event.datetime_end, '%H:%i %d-%m-%Y') AS formatted_date2, id_location, image_mimetype, image, users.id_users, users.id_users, username, email, genre.id_genre, genre.genre_name FROM Users JOIN Event ON Event.id_users = Users.id_users JOIN genre_event ON event.id_event = genre_event.id_event JOIN genre ON genre_event.id_genre = genre.id_genre ORDER BY datetime_start''')
        data = cur.fetchall()
        cur.close()
        return jsonify(data), 200
    except Exception as e:
        error_response = {
            'success': False,
            'message': str(e)
        }
        return jsonify(error_response), 500


@app.route('/login_users', methods=['POST']) #prijava uporabnika
@cross_origin()
def login_users():
    try:
        # Retrieve form data
        username = request.form.get('username')
        password = request.form.get('password')

        # Check if user exists in the database
        cursor = mysql.connection.cursor()
        cursor.execute('SELECT * FROM Users WHERE username = %s AND password = %s', (username, password))
        user = cursor.fetchone()
        cursor.close()

        if user:
            # If user exists, return OK message
            response = {
                'success': True,
                'message': 'User exists in the database',
                'user': user,
                'id_user': user[0],
                'username': user[1],
                'email': user[2],
                'admin': user[4]
            }
            return jsonify(response), 200
        else:
            # If user does not exist, return not found message
            response = {
                'success': False,
                'message': 'User does not exist in the database'
            }
            return jsonify(response), 200
    except Exception as e:
        error_response = {
            'success': False,
            'message': str(e)
        }
        return jsonify(error_response), 500

@app.route('/register_users', methods=['POST']) #prijava uporabnika
@cross_origin()
def register_users():
    try:
        # Retrieve form data
        email = request.form.get('email')
        username = request.form.get('username')
        password = request.form.get('password')

        # Check if user exists in the database
        cursor = mysql.connection.cursor()
        cursor.execute('INSERT INTO Users (email, username, password) VALUES (%s, %s, %s)', (email, username, password))
        mysql.connection.commit()
        cursor.close()

        response = {
            'success': True,
            'message': 'Registered successfully'
        }
        return jsonify(response), 200
    except Exception as e:
        error_response = {
            'success': False,
            'message': str(e)
        }
        return jsonify(error_response), 500


@app.route('/create_event', methods=['POST']) #ustvari nov Event v bazi
@cross_origin()
def create_event():
    try:
        cur = mysql.connection.cursor()

        title = request.form.get('title')
        description = request.form.get('description')
        datetime_start = request.form.get('datetime_start')
        datetime_end = request.form.get('datetime_end')
        image = request.files['id_image']
        id_user = request.form.get('id_user')
        id_genre = request.form.get('genre')


        image_data = image.read()
        image_mimetype = image.mimetype
        encoded_image = base64.b64encode(image_data)

        city = request.form.get('city_location')
        address = request.form.get('address_location')
        coordinates = request.form.get('coordinate_location')

        cur.execute('''INSERT INTO Location (kraj, naslov, koordinati) VALUES (%s, %s, %s)''', (city, address, coordinates))

        cur.execute('SELECT id_location FROM Location WHERE kraj = %s AND naslov = %s AND koordinati = %s', (city, address, coordinates))
        location = cur.fetchone()

        id_location = int(location[0])

        if not datetime_end: #datetime_end ni obvezen, zato 2 querrja, odvisno če uporabnik nastavi kdaj se dogodek konča ali ne
            cur.execute('''INSERT INTO Event (title, description, datetime_start, id_location, image, image_mimetype, id_users) VALUES (%s, %s, %s, %s, %s, %s, %s)''', (title, description, datetime_start, id_location, encoded_image, image_mimetype, id_user))
        else:
            cur.execute('''INSERT INTO Event (title, description, datetime_start, datetime_end, id_location, image, image_mimetype, id_users) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)''', (title, description, datetime_start, datetime_end, id_location, encoded_image, image_mimetype, id_user))

        cur.execute('SELECT id_event FROM Event WHERE title = %s AND description = %s', (title, description))
        id_event = cur.fetchone()

        cur.execute('''INSERT INTO genre_event (id_event, id_genre) VALUES (%s, %s)''', (id_event[0], id_genre))

        mysql.connection.commit()
        cur.close()
        response = {
            'success': True,
            'message': 'Data added successfully'
        }
        return jsonify(response), 200
    except Exception as e:
        error_response = {
            'success': False,
            'message': str(e)
        }
        print(error_response)
        return jsonify(error_response), 500

@app.route('/get_event', methods=['GET']) # vrne event z določenim id-jom
@cross_origin()
def get_event():
    try:
        id_event = int(request.args.get('id_event'))
        cur = mysql.connection.cursor()
        cur.execute('''SELECT event.id_event, event.title, event.description, event.datetime_start, event.datetime_end, id_location, image_mimetype, image, users.id_users, users.id_users, username, email, genre.id_genre, genre.genre_name FROM Users JOIN Event ON Event.id_users = Users.id_users JOIN genre_event ON event.id_event = genre_event.id_event JOIN genre ON genre_event.id_genre = genre.id_genre  WHERE event.id_event = %s UNION ALL select count(*), NULL AS a, NULL AS a, NULL AS a, NULL AS a, NULL AS a, NULL AS a, NULL AS a, NULL AS a, NULL AS a, NULL AS a, NULL AS a, NULL AS a, NULL AS a from event_users_interested where id_event = %s and going_or_interested = 1 UNION ALL select count(*), NULL AS a, NULL AS a, NULL AS a, NULL AS a, NULL AS a, NULL AS a, NULL AS a, NULL AS a, NULL AS a, NULL AS a, NULL AS a, NULL AS a, NULL AS a from event_users_interested where id_event = %s and going_or_interested = 0;''', (id_event, id_event, id_event))
        data = cur.fetchall()
        cur.close()
        return jsonify(data), 200
    except Exception as e:
        return jsonify({'error': e}), 400
    

@app.route('/get_genre', methods=['GET']) # vrne žanro z določenim id-jom
@cross_origin()
def get_genre():
    try:
        id_genre = int(request.args.get('id_genre'))
        cur = mysql.connection.cursor()
        cur.execute('SELECT * FROM Genre WHERE id_genre = %s', (id_genre,))
        data = cur.fetchall()
        cur.close()
        return jsonify(data), 200
    except Exception as e:
        return jsonify({'error': e}), 400
    

@app.route('/genres', methods=['GET']) #vrne vse podatke iz tabele Genre
@cross_origin()
def get_genres():
    try:
        cur = mysql.connection.cursor()
        cur.execute('''SELECT * FROM Genre''')
        data = cur.fetchall()
        cur.close()
        return jsonify(data), 200
    except Exception as e:
        error_response = {
            'success': False,
            'message': str(e)
        }
        return jsonify(error_response), 500
    
@app.route('/create_genre', methods=['POST']) #ustvari nov Genre v bazi
@cross_origin()
def create_genre():
    try:
        cur = mysql.connection.cursor()

        title = request.form.get('title')
        description = request.form.get('description')
        example = request.form.get('example')


        cur.execute('''INSERT INTO Genre (genre_name, description, example) VALUES (%s, %s, %s)''', (title, description, example))

        mysql.connection.commit()
        cur.close()
        response = {
            'success': True,
            'message': 'Data added successfully'
        }
        return jsonify(response), 200
    except Exception as e:
        error_response = {
            'success': False,
            'message': str(e)
        }
        return jsonify(error_response), 500
    
@app.route('/event_going', methods=['POST']) #uporabnik gre na event
@cross_origin()
def event_going():
    try:
        cur = mysql.connection.cursor()

        id_event = request.form.get('id_event')
        id_users = request.form.get('id_user')

        cur.execute('''INSERT INTO event_users_interested (id_event, id_users, going_or_interested) VALUES (%s, %s, %s)''', (id_event, id_users, 0))

        mysql.connection.commit()
        cur.close()
        response = {
            'success': True,
            'message': 'Data added successfully'
        }
        return jsonify(response), 200
    except Exception as e:
        error_response = {
            'success': False,
            'message': str(e)
        }
        return jsonify(error_response), 500
    
@app.route('/event_interested', methods=['POST']) #uporabnik je zainterisiran za event
@cross_origin()
def event_interested():
    try:
        cur = mysql.connection.cursor()

        id_event = request.form.get('id_event')
        id_users = request.form.get('id_user')

        cur.execute('''INSERT INTO event_users_interested (id_event, id_users, going_or_interested) VALUES (%s, %s, %s)''', (id_event, id_users, 1))

        mysql.connection.commit()
        cur.close()
        response = {
            'success': True,
            'message': 'Data added successfully'
        }
        return jsonify(response), 200
    except Exception as e:
        error_response = {
            'success': False,
            'message': str(e)
        }
        return jsonify(error_response), 500
    
@app.route('/users_events', methods=['GET']) #izpis vseh eventov na katere je uporabin interested/going
@cross_origin()
def users_events():
    try:
        cur = mysql.connection.cursor()
        
        id_user = request.args.get('id')
        
        cur.execute('SELECT * FROM Event JOIN event_users_interested ON Event.id_event = event_users_interested.id_event where event_users_interested.id_users = %s;', (id_user,))
        data = cur.fetchall()
        cur.close()
        return jsonify(data), 200
    except Exception as e:
        error_response = {
            'success': False,
            'message': str(e)
        }
        return jsonify(error_response), 500
    
@app.route('/comments', methods=['GET']) #izpis vseh komentarjev od eventa
@cross_origin()
def get_comments():
    try:
        cur = mysql.connection.cursor()

        id_event = int(request.args.get('id_event'))

        cur.execute('select * from Comment join Users on Comment.id_users = Users.id_users where id_event = %s;', (id_event,))
        data = cur.fetchall()
        cur.close()
        return jsonify(data), 200
    except Exception as e:
        error_response = {
            'success': False,
            'message': str(e)
        }
        return jsonify(error_response), 500

@app.route('/comment', methods=['POST']) #dodaj komentar
@cross_origin()
def comment():
    try:
        cur = mysql.connection.cursor()

        text = request.form.get('text')
        date = datetime.now()
        id_event = request.form.get('id_event')
        id_users = request.form.get('id_user')

        cur.execute('''INSERT INTO Comment (text, date, id_event, id_users) VALUES (%s, %s, %s, %s)''', (text, date, id_event, id_users))

        mysql.connection.commit()
        cur.close()
        response = {
            'success': True,
            'message': 'Data added successfully'
        }
        return jsonify(response), 200
    except Exception as e:
        error_response = {
            'success': False,
            'message': str(e)
        }
        return jsonify(error_response), 500
    
@app.route('/subcomment', methods=['POST']) #dodaj komentar
@cross_origin()
def subcomment():
    try:
        cur = mysql.connection.cursor()

        text = request.form.get('subtext')
        date = datetime.now()
        id_event = request.form.get('id_event')
        id_users = request.form.get('id_user')
        id_parent_comment = request.form.get('id_comment')

        cur.execute('''INSERT INTO Comment (text, date, id_event, id_users, id_parent_comment) VALUES (%s, %s, %s, %s, %s)''', (text, date, id_event, id_users, id_parent_comment))

        mysql.connection.commit()
        cur.close()
        response = {
            'success': True,
            'message': 'Data added successfully'
        }
        return jsonify(response), 200
    except Exception as e:
        error_response = {
            'success': False,
            'message': str(e)
        }
        return jsonify(error_response), 500
    
@app.route('/event_search_title', methods=['POST']) #najdi event po imenu
@cross_origin()
def event_search_title():

    try:
        cur = mysql.connection.cursor()

        title = request.form.get('title')
        title = f"%{title}%"

        #cur.execute('''SELECT * FROM Event WHERE title LIKE %s''', (title,))
        cur.execute('''SELECT * FROM Event JOIN genre_event ON event.id_event = genre_event.id_event JOIN genre ON genre_event.id_genre = genre.id_genre WHERE title LIKE %s OR event.description like %s OR genre_name LIKE %s OR datetime_start LIKE %s;''', (title,title,title,title))

        data = cur.fetchall()
        cur.close()
        return jsonify(data), 200
    except Exception as e:
        error_response = {
            'success': False,
            'message': str(e)
        }
        return jsonify(error_response), 500
    
@app.route('/order_by', methods=['POST']) #razvrsti po datumu/število zainteresiranih
@cross_origin()
def order_by():
    try:
        cur = mysql.connection.cursor()

        order = request.form.get('order')
        if order == 'st_interested':
            cur.execute('''SELECT event.id_event, event.title, event.description, event.datetime_start, event.datetime_end, id_location, image_mimetype, image, users.id_users, users.id_users, username, email, genre.id_genre, genre.genre_name FROM Users JOIN Event ON Event.id_users = Users.id_users JOIN genre_event ON event.id_event = genre_event.id_event JOIN genre ON genre_event.id_genre = genre.id_genre ORDER BY datetime_start''')
        elif order == 'date_soon':
            cur.execute('''SELECT event.id_event, event.title, event.description, event.datetime_start, event.datetime_end, id_location, image_mimetype, image, users.id_users, users.id_users, username, email, genre.id_genre, genre.genre_name FROM Users JOIN Event ON Event.id_users = Users.id_users JOIN genre_event ON event.id_event = genre_event.id_event JOIN genre ON genre_event.id_genre = genre.id_genre ORDER BY datetime_start''')
        elif order == 'date_distant':
            cur.execute('''SELECT event.id_event, event.title, event.description, event.datetime_start, event.datetime_end, id_location, image_mimetype, image, users.id_users, users.id_users, username, email, genre.id_genre, genre.genre_name FROM Users JOIN Event ON Event.id_users = Users.id_users JOIN genre_event ON event.id_event = genre_event.id_event JOIN genre ON genre_event.id_genre = genre.id_genre ORDER BY datetime_start desc''')

        data = cur.fetchall()
        cur.close()
        return jsonify(data), 200
    except Exception as e:
        error_response = {
            'success': False,
            'message': str(e)
        }
        return jsonify(error_response), 500
    
@app.route('/event_location', methods=['GET']) #vrne lokacijo eventa
@cross_origin()
def event_location():
    try:
        cur = mysql.connection.cursor()

        id_event = int(request.args.get('id_event'))

        cur.execute('''SELECT location.id_location, kraj, naslov, koordinati FROM location JOIN event on location.id_location = event.id_location where id_event = %s;''', (id_event,))
        data = cur.fetchall()
        cur.close()
        return jsonify(data), 200
    except Exception as e:
        error_response = {
            'success': False,
            'message': str(e)
        }
        print(error_response)
        return jsonify(error_response), 500

if __name__ == '__main__':
    app.run(debug=True)
