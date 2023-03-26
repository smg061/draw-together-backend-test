package drawing

type Point struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
}

type Stroke struct {
	Points []Point `json:"points"`
	Color  string  `json:"color"`
}

type Drawing struct {
	Strokes []Stroke `json:"strokes"`
}

func (d *Drawing) AddStroke(s Stroke) {
	d.Strokes = append(d.Strokes, s)
}

