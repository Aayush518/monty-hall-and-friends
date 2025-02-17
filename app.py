from flask import Flask, render_template, request, jsonify
from monty_hall import advanced_monty_hall_simulation

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/simulate', methods=['POST'])
def simulate():
    data = request.get_json()
    trials = data['trials']
    doors = data['doors']
    stay_result = advanced_monty_hall_simulation(False, trials, doors)
    switch_result = advanced_monty_hall_simulation(True, trials, doors)
    return jsonify({
        'stay_percentage': stay_result,
        'switch_percentage': switch_result
    })

if __name__ == '__main__':
    app.run(debug=True)