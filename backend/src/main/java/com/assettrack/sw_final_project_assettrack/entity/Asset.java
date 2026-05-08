package com.assettrack.sw_final_project_assettrack.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Asset")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String sn;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private String brand;

    @Builder.Default
    private String status="AVAILABLE"; // default status is working

    @Column(nullable = false)
    private String model;

    @Column(nullable = false)
    private LocalDate purchaseDate;
    
    @Column(nullable = false)
    private LocalDate warrantyEndDate;


    @ManyToOne(fetch = FetchType.LAZY)
    private User user;


    @OneToMany(mappedBy = "asset", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<History> histories = new ArrayList<>();
   
        
    @OneToMany(mappedBy = "asset", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Report> reports = new ArrayList<>();
}
