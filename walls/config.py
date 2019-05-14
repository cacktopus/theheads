from dataclasses import dataclass


@dataclass
class Config:
    width: float
    height: float
    depth: float
    r: float
    line_width: float
    pad_x: float
    pad_y: float
