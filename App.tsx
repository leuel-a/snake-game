import {useState, useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import {StyleSheet, View, Text, TouchableOpacity, Dimensions} from 'react-native';
import type {TouchableOpacityProps} from 'react-native';

const GRID_SIZE = 20;
const GAME_CONTAINER_WIDTH = Math.floor(Dimensions.get('window').width * 0.9);
const GAME_CONTAINER_HEIGHT = Math.floor(Dimensions.get('window').height * 0.7);

interface Coordinate {
  row: number;
  col: number;
}

type Direction = 'RIGHT' | 'LEFT' | 'UP' | 'DOWN';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [direction, setDirection] = useState<Direction>('DOWN');
  const [food, setFood] = useState<Coordinate>({row: 10, col: 10});
  const [snake, setSnake] = useState<Coordinate[]>([{row: 10, col: 10}]);

  const onStartButtonPress = () => setGameStarted(prev => !prev);

  const getNextDirection = (head: Coordinate) => {
    switch (direction) {
      case 'RIGHT':
        head.row += 1;
        break;
      case 'LEFT':
        head.row -= 1;
        break;
      case 'UP':
        head.col -= 1;
        break;
      case 'DOWN':
        head.col += 1;
        break;
    }

    if (head.row <= 0) {
      head.row = GRID_SIZE - 1;
    }
    if (head.row >= GRID_SIZE) {
      head.row = 0;
    }
    if (head.col < 0) {
      head.col = GRID_SIZE - 1;
    }
    if (head.col >= GRID_SIZE) {
      head.col = 0;
    }
  };

  const setSnakeDirection = (newDirection: Direction) => {
    if (direction === newDirection) return;

    if (direction === 'UP' && newDirection === 'DOWN') return;
    if (direction === 'DOWN' && newDirection === 'UP') return;
    if (direction === 'LEFT' && newDirection === 'RIGHT') return;
    if (direction === 'RIGHT' && newDirection === 'LEFT') return;

    setDirection(newDirection);
  };

  const moveSnake = () => {
    const head = {...snake[0]};
    const newSnake = [...snake];

    // get the next point the snake will exist
    getNextDirection(head);

    newSnake.unshift(head);
    if (head.row === food.row && head.col === food.col) {
    } else {
    }
    newSnake.pop();

    setSnake(newSnake);
  };

  useEffect(() => {
    if (gameStarted) {
      const gameLoop = setInterval(() => {
        moveSnake();
      }, 200);

      return () => clearInterval(gameLoop);
    }
  }, [gameStarted, snake]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {!gameStarted ? (
            <TouchableOpacity style={styles.startGameButton} onPress={onStartButtonPress}>
              <Text style={styles.startGameButtonText}>Start Game</Text>
            </TouchableOpacity>
          ) : (
            <>
              <View style={styles.gameContainer}>
                {snake.map((segment, index) => (
                  <View
                    key={index}
                    style={[
                      styles.snakeSegment,
                      {
                        left: segment.row * (GAME_CONTAINER_WIDTH / GRID_SIZE),
                        top: segment.col * (GAME_CONTAINER_HEIGHT / GRID_SIZE),
                      },
                    ]}
                  ></View>
                ))}
                <View
                  style={[
                    styles.food,
                    {
                      left: food.row * (GAME_CONTAINER_WIDTH / GRID_SIZE),
                      top: food.col * (GAME_CONTAINER_HEIGHT / GRID_SIZE),
                    },
                  ]}
                ></View>
              </View>
              <View style={[styles.directionButtonContainer]}>
                <DirectionButton onPress={() => setSnakeDirection('LEFT')}>Left</DirectionButton>
                <DirectionButton onPress={() => setSnakeDirection('UP')}>Up</DirectionButton>
                <DirectionButton onPress={() => setSnakeDirection('DOWN')}>Down</DirectionButton>
                <DirectionButton onPress={() => setSnakeDirection('RIGHT')}>Right</DirectionButton>
              </View>
            </>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export interface DirectionButtonProps extends PropsWithChildren, TouchableOpacityProps {}

export function DirectionButton({children, ...props}: DirectionButtonProps) {
  return (
    <TouchableOpacity {...props} style={styles.directionButton}>
      <Text style={[styles.text, {fontSize: 10}]}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'PressStart2P-Regular',
  },
  startGameButton: {
    padding: 20,
    paddingVertical: 20,
    borderRadius: 10,
    backgroundColor: '#00FF00',
  },
  startGameButtonText: {
    fontFamily: 'PressStart2P-Regular',
  },
  gameContainer: {
    width: GAME_CONTAINER_WIDTH,
    height: GAME_CONTAINER_HEIGHT,
    backgroundColor: '#44403c',
    position: 'relative',
  },
  snakeSegment: {
    position: 'absolute',
    width: GRID_SIZE,
    height: GRID_SIZE,
    backgroundColor: '#d97706',
  },
  food: {
    position: 'absolute',
    width: GRID_SIZE,
    height: GRID_SIZE,
    backgroundColor: '#fef2f2',
  },
  directionButtonContainer: {
    gap: 10,
    marginTop: 20,
    flexDirection: 'row',
  },
  directionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 30,
    borderRadius: 5,
    backgroundColor: '#d6d3d1',
  },
});

export default App;
